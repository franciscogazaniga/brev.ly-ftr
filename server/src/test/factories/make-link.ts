import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'

export async function makeLink(
  overrides?: Partial<InferInsertModel<typeof schema.links>>
) {
  const slug = faker.word.sample()

  const result = await db
    .insert(schema.links)
    .values({
      originalLink: `http://example.com/`,
      shortenedLink: slug,
      accessCount: 0,
      ...overrides,
    })
    .returning()

  return result[0]
}