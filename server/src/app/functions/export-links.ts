import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { type Either, makeRight } from '@/shared/either'
import { stringify } from 'csv-stringify'
import { ilike } from 'drizzle-orm'
import { z } from 'zod'

const exportLinksInput = z.object({
  searchQuery: z.string().optional(),
})

type ExportLinksInput = z.input<typeof exportLinksInput>
type ExportLinksOutput = {
  reportUrl: string
}
type ExportLinksError = never

export async function exportLinks(
  input: ExportLinksInput
): Promise<Either<ExportLinksError, ExportLinksOutput>> {
  const { searchQuery } = exportLinksInput.parse(input)

  const { sql, params } = db
    .select({
      id: schema.links.id,
      originalLink: schema.links.originalLink,
      shortenedLink: schema.links.shortenedLink,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
    .from(schema.links)
    .where(
      searchQuery ? ilike(schema.links.shortenedLink, `%${searchQuery}%`) : undefined // ilike is used for case-insensitive search
    )
    .toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(2)

  const csv = stringify({
    // Transform the cursor to a CSV stream
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'original_link', header: 'Original URL' },
      { key: 'shortened_link', header: 'Short URL' },
      { key: 'access_count', header: 'Access Count' },
      { key: 'created_at', header: 'Created At' },
    ],
  })

  const uploadToStorageStream = new PassThrough() // PassTrough stream to pipe the CSV data to the storage

  const convertToCSVPipeline = pipeline(
    cursor,
    new Transform({
      // Transform stream to convert the cursor data to CSV format
      objectMode: true, // Enable object mode to process objects
      transform(chunks: unknown[], enconding, callback) {
        for (const chunk of chunks) {
          this.push(chunk) // Push each chunk to the stream
        }

        callback() // Call the callback to signal that the transformation is complete
      },
    }),
    csv,
    uploadToStorageStream // Pipe the cursor to the CSV stream and then to the uploadToStorage stream
  )

  const uploadToStorage = uploadFileToStorage({
    fileName: `${new Date().toISOString()}-links.csv`,
    contentType: 'text/csv',
    folder: 'downloads',
    contentStream: uploadToStorageStream,
  })

  const [{ url }] = await Promise.all([uploadToStorage, convertToCSVPipeline]) // Wait for both streams to finish

  return makeRight({ reportUrl: url }) // Return the URL of the uploaded file
}