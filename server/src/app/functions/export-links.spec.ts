import { randomUUID } from 'node:crypto'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { isRight, unwrapEither } from '@/shared/either'
import { describe, expect, it, vi } from 'vitest'
import { makeLink } from '@/test/factories/make-link'
import { exportLinks } from './export-links'

describe('export links', () => {
  it('should be able to export links', async () => {
    const uploadStub = vi // stub is a test double that replaces the original function with a mock implementation
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${randomUUID()}.csv`,
          url: 'https://storage.com/report.csv',
        }
      })

    const slugPattern = randomUUID()

    const link1 = await makeLink({shortenedLink: `${slugPattern}-1`})
    const link2 = await makeLink({shortenedLink: `${slugPattern}-2`})
    const link3 = await makeLink({shortenedLink: `${slugPattern}-3`})
    const link4 = await makeLink({shortenedLink: `${slugPattern}-4`})
    const link5 = await makeLink({shortenedLink: `${slugPattern}-5`})

    const sut = await exportLinks({
      searchQuery: slugPattern,
    })

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generatedCSVStream
        .on('data', (chunk: Buffer) => {
          chunks.push(chunk)
        })
        .on('error', error => {
          reject(error)
        })
        .on('end', () => {
          resolve(Buffer.concat(chunks).toString('utf-8'))
        })
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(line => line.split(','))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut)).toEqual({
      reportUrl: 'https://storage.com/report.csv',
    })
    expect(csvAsArray).toEqual([
      ['ID', 'Original URL', 'Short URL', 'Access Count', 'Created At'],
      [
        link1.id.toString(),
        link1.originalLink,
        link1.shortenedLink,
        link1.accessCount.toString(),
        expect.any(String),
      ],
      [
        link2.id.toString(),
        link2.originalLink,
        link2.shortenedLink,
        link1.accessCount.toString(),
        expect.any(String),
      ],
      [
        link3.id.toString(),
        link3.originalLink,
        link3.shortenedLink,
        link1.accessCount.toString(),
        expect.any(String),
      ],
      [
        link4.id.toString(),
        link4.originalLink,
        link4.shortenedLink,
        link1.accessCount.toString(),
        expect.any(String),
      ],
      [
        link5.id.toString(),
        link5.originalLink,
        link5.shortenedLink,
        link1.accessCount.toString(),
        expect.any(String),
      ],
    ])
  })
})