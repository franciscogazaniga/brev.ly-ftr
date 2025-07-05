import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/shared/either'
import { asc, desc, ilike, sql } from 'drizzle-orm'
import { z } from 'zod'

const getLinksInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
})

type GetLinksInput = z.input<typeof getLinksInput>

type GetLinksOutput = {
  total: number
  links: Array<{
    id: string
    originalLink: string
    customSlug: string
    amountAccess: number
    createdAt: Date
  }>
}
type GetLinksError = never

export async function getLinks(
  input: GetLinksInput
): Promise<Either<GetLinksError, GetLinksOutput>> {
  const { page, pageSize, searchQuery, sortBy, sortDirection } =
    getLinksInput.parse(input)

  const [links, [{ total }]] = await Promise.all([
    db
      .select({
        id: schema.links.id,
        originalLink: schema.links.originalLink,
        customSlug: schema.links.shortenedLink,
        amountAccess: schema.links.accessCount,
        createdAt: schema.links.createdAt,
      })
      .from(schema.links)
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .where(
        searchQuery ? ilike(schema.links.shortenedLink, `%${searchQuery}%`) : undefined // ilike is used for case-insensitive search
      )
      .orderBy(fields => {
        if (sortBy && sortDirection === 'asc') {
          return asc(fields[sortBy])
        }

        if (sortBy && sortDirection === 'desc') {
          return desc(fields[sortBy])
        }

        return desc(fields.id)
      }),

    db
      .select({ total: sql<number>`count(*)` })
      .from(schema.links)
      .where(
        searchQuery ? ilike(schema.links.shortenedLink, `%${searchQuery}%`) : undefined
      ),
  ])

  return makeRight({ links, total: Number(total) })
}