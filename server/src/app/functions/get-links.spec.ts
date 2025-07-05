import { isRight, unwrapEither } from '@/shared/either'
import dayjs from 'dayjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { makeLink } from '@/test/factories/make-link'
import { getLinks } from './get-links'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

describe('get links', () => {
  beforeEach(async () => {
    await db.delete(schema.links)
  })

  it('should be able to get the links', async () => {
    const link1 = await makeLink()
    const link2 = await makeLink()
    const link3 = await makeLink()
    const link4 = await makeLink()
    const link5 = await makeLink()

    const sut = await getLinks({
      sortBy: 'createdAt',
    })

    // console.log(unwrapEither(sut))
    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({
        id: link5.id,
      }),
      expect.objectContaining({
        id: link4.id,
      }),
      expect.objectContaining({
        id: link3.id,
      }),
      expect.objectContaining({
        id: link2.id,
      }),
      expect.objectContaining({
        id: link1.id,
      }),
    ])
  })

  it('should be able to get the original link with a slug', async () => {
    const link1 = await makeLink({originalLink: 'https://example.com/', shortenedLink: 'example'})
    const link2 = await makeLink()
    const link3 = await makeLink()
    const link4 = await makeLink()
    const link5 = await makeLink()

    const sut = await getLinks({
      searchQuery: 'example'
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(1)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({
        originalLink: link1.originalLink
      }),
    ])
  })

  it('should be able to get paginated links', async () => {
    const link1 = await makeLink()
    const link2 = await makeLink()
    const link3 = await makeLink()
    const link4 = await makeLink()
    const link5 = await makeLink()

    let sut = await getLinks({
      sortBy: 'createdAt',
      page: 1,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({
        id: link5.id,
      }),
      expect.objectContaining({
        id: link4.id,
      }),
      expect.objectContaining({
        id: link3.id,
      }),
    ])

    sut = await getLinks({
      sortBy: 'createdAt',
      page: 2,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({
        id: link2.id,
      }),
      expect.objectContaining({
        id: link1.id,
      }),
    ])
  })

  it('should be able to get sorted links', async () => {
    const link1 = await makeLink({
      createdAt: new Date(),
    })
    const link2 = await makeLink({
      createdAt: dayjs().subtract(1, 'day').toDate(),
    })
    const link3 = await makeLink({
      createdAt: dayjs().subtract(2, 'day').toDate(),
    })
    const link4 = await makeLink({
      createdAt: dayjs().subtract(3, 'day').toDate(),
    })
    const link5 = await makeLink({
      createdAt: dayjs().subtract(4, 'day').toDate(),
    })

    let sut = await getLinks({
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({
        id: link1.id,
      }),
      expect.objectContaining({
        id: link2.id,
      }),
      expect.objectContaining({
        id: link3.id,
      }),
      expect.objectContaining({
        id: link4.id,
      }),
      expect.objectContaining({
        id: link5.id,
      }),
    ])

    sut = await getLinks({
      sortBy: 'createdAt',
      sortDirection: 'asc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).links).toEqual([
      expect.objectContaining({
        id: link5.id,
      }),
      expect.objectContaining({
        id: link4.id,
      }),
      expect.objectContaining({
        id: link3.id,
      }),
      expect.objectContaining({
        id: link2.id,
      }),
      expect.objectContaining({
        id: link1.id,
      }),
    ])
  })
})