import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeLink } from '@/test/factories/make-link'
import { incrementLinkAccess } from './increment-access'

describe('increment link access', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  it('should be able to increment link access', async () => {
    const link1 = await makeLink()

    await incrementLinkAccess(link1.id)
    await incrementLinkAccess(link1.id)

    const result = await db
      .select()
      .from(schema.links)

    expect(result).toHaveLength(1)
    expect(result[0].accessCount).toEqual(2)
  })
})