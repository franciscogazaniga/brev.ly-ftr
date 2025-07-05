import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { eq, sql } from 'drizzle-orm'
import { makeLeft, makeRight, type Either } from '@/shared/either'
import { LinkNotFound } from './errors/link-not-found'

type GetLinksOutput = {
  id: string
  amountAccess: number
}

export async function incrementLinkAccess(
  linkId: string
): Promise<Either<LinkNotFound, GetLinksOutput>> {
  const result = await db
    .update(schema.links)
    .set({
      accessCount: sql`${schema.links.accessCount} + 1`,
    })
    .where(eq(schema.links.id, linkId))
    .returning({
      id: schema.links.id,
      amountAccess: schema.links.accessCount,
    })

  if (Array.isArray(result) && result.length === 0) {
    return makeLeft(new LinkNotFound())
  }

  return makeRight(result[0])
}