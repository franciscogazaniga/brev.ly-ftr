import { createLink } from "@/app/functions/create-link";
import { GenericErrorInvalidInput } from "@/app/functions/errors/generic-error-invalid-input";
import { isRight, unwrapEither } from "@/shared/either";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

// Type guard
function isGenericErrorInvalidInput(error: any): error is GenericErrorInvalidInput {
  return error?.name === 'InvalidInputFormat' && Array.isArray(error.issues);
}

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
        case 'SlugAlreadyExists':
          return reply.status(400).send({ message: error.message })
        case 'InvalidInputFormat':
          console.log("Input inválido")
          if (isGenericErrorInvalidInput(error)) {
            return reply.status(400).send({
              message: error.message,
              errors: error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message,
              })),
            })
          }
        default:
          return reply.status(500).send({ message: 'Unexpected error' })
      }
  })
}