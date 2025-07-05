import { createLink } from "@/app/functions/create-link";
import { isRight, unwrapEither } from "@/shared/either";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post('/links', {
      schema: {
        summary: 'Create a shortened link',
        tags: ['create-link'],
        body: z.object({
          originalLink: z.string().url().describe('The link to be shortened.'),
          customSlug: z.string().describe('Custom slug for the shortened link.'),
        }).describe('Create a new shortened link.'),
        response: {
          201: z.object({ shortenedLink: z.string() }).describe('Shortened Link created.'),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
  }, 
    async (request, reply) => {
      const { originalLink, customSlug } = request.body as { originalLink: string, customSlug: string }
      
      const result = await createLink({
        originalLink,
        customSlug,
      })

      if (isRight(result)) {
        console.log('Link: ', unwrapEither(result))
        const { shortenedLink } = unwrapEither(result)
        return reply.status(201).send({ shortenedLink })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'InvalidLinkFormat':
          return reply.status(400).send({ message: error.message })
        default:
          return reply.status(500).send({ message: 'Unexpected error' })
      }
  })
}