import { randomUUID } from 'node:crypto'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { beforeEach, describe, expect, it } from 'vitest'
import { createLink } from './create-link'
import { InvalidLinkFormat } from './errors/invalid-link-format'
import { SlugAlreadyExists } from './errors/slug-already-exists'
import { InvalidSlugFormat } from './errors/invalid-slug-format'

describe('create link', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  it('should be able to create a link', async () => {
    const originalLink = `https://${randomUUID()}.com.br`
    const customSlug = `teste-${randomUUID()}`

    const sut = await createLink({
      originalLink,
      customSlug
    })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.originalLink, originalLink))

    expect(result).toHaveLength(1)
  })

  it('should not be able to create an invalid link', async () => {
    const originalLink = randomUUID()
    const customSlug = 'teste'

    const sut = await createLink({
      originalLink,
      customSlug
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidLinkFormat)
  })

  it('should not be able to create an invalid slug', async () => {
    const originalLink = `https://${randomUUID()}.com.br`
    const customSlug = `teste_${randomUUID()}`

    const sut = await createLink({
      originalLink,
      customSlug
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidSlugFormat)
  })

  it('should not be able to create a link with a slug that already exists', async () => {
    const originalLink = `https://${randomUUID()}.com.br`
    const customSlug1 = `slug1`

    await createLink({
      originalLink,
      customSlug: customSlug1,
    })

    const customSlug2 = `slug1`

    const sut = await createLink({
      originalLink,
      customSlug: customSlug2,
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(SlugAlreadyExists)
  })
})