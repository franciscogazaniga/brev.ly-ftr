import { getLinks } from '@/app/functions/get-links'
import { unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'Get links',
        tags: ['get-links'],
        querystring: z.object({
          searchQuery: z.string().optional().default(''),
          sortBy: z.enum(['createdAt']).optional().describe('Sort by field'),
          sortDirection: z.enum(['asc', 'desc']).optional().describe('Sort direction'),
          page: z.coerce.number().optional().default(1),
          pageSize: z.coerce.number().optional().default(20),
        }),
        response: {
          200: z.object({
            links: z.array(
              z.object({
                id: z.string(),
                originalLink: z.string(),
                customSlug: z.string(),
                amountAccess: z.number(),
                createdAt: z.date(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { searchQuery, sortBy, sortDirection, page, pageSize } =
        request.query

      const result = await getLinks({
        searchQuery,
        sortBy,
        sortDirection,
        page,
        pageSize,
      })


      const { links, total } = unwrapEither(result)

      return reply.status(200).send({ links, total })
    }
  )
}