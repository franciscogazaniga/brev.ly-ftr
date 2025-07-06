import { getLinks } from '@/app/functions/get-links'
import { incrementLinkAccess } from '@/app/functions/increment-access'
import { unwrapEither } from '@/shared/either'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getOriginalLinkBySlug: FastifyPluginAsyncZod = async server => {
  server.get(
    '/:customSlug',
    {
      schema: {
        summary: 'Get original link by slug',
        tags: ['get-original-link'],
        params: z.object({
          customSlug: z.string(),
        }),
        response: {
          200: z.object({ originalLink: z.string().url() }),
        },
      },
    },
    async (request, reply) => {
      const { customSlug } = request.params as { customSlug: string }
      
      const result = await getLinks({
        searchQuery: customSlug,
      })


      const { links } = unwrapEither(result)
      const originalLink = links[0]?.originalLink
      const linkId = links[0]?.id

      if (linkId) {
        await incrementLinkAccess(linkId)
      }

      console.log("Response from API:", originalLink)
      return reply.status(200).send({ originalLink })
    }
  )
}