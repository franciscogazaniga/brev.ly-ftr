import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { LinkNotFound } from './errors/link-not-found'
import { Either, makeLeft, makeRight } from '@/shared/either'
import { eq } from 'drizzle-orm'

export async function deleteLink(id: string): Promise<Either<LinkNotFound, null>> {
  const existingLink = await db.query.links.findFirst({
    where: (links, { eq }) => eq(links.id, id),
  })

  if (!existingLink) {
    return makeLeft(new LinkNotFound())
  }

  await db.delete(schema.links).where(eq(schema.links.id, existingLink.id))

  return makeRight(null)
}