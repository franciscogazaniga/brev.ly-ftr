import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeLink } from '@/test/factories/make-link'
import { deleteLink } from './delete-link'

describe('delete link', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  it('should be able to delete a link with id', async () => {
    const link1 = await makeLink()
    const link2 = await makeLink()

    await deleteLink(link1.id)

    const result = await db
      .select()
      .from(schema.links)

    expect(result).toHaveLength(1)
    expect(result[0].id).toEqual(link2.id)
  })
})