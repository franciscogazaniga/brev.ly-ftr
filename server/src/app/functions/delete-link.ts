import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { eq } from 'drizzle-orm'

export async function deleteLink(id: string) {
  await db.delete(schema.links).where(eq(schema.links.id, id))
}