import { createLink } from "@/app/functions/create-link";
import { deleteLink } from "@/app/functions/delete-link";
import { isRight, unwrapEither } from "@/shared/either";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const deleteLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete('/links/:linkId', {
      schema: {
        summary: 'Delete a shortened link by ID',
        tags: ['delete-link'],
        params: z.object({
          linkId: z.string().describe('The link id to be deleted.'),
        }).describe('Delete a shortened link.'),
        response: {
          204: z.undefined().describe('Link deleted successfully'),
          404: z.object({ message: z.string() }).describe('Link not found'),
          500: z.object({ message: z.string() }).describe('Unexpected error'),
        },
      },
  }, 
    async (request, reply) => {
      const { linkId } = request.params as { linkId: string }
      
      const result = await deleteLink(linkId)

      if (isRight(result)) {
        return reply.status(204).send()
      }
  
      const error = unwrapEither(result)
  
      switch (error.constructor.name) {
        case 'LinkNotFound':
          return reply.status(404).send({ message: error.message })
        default:
          return reply.status(500).send({ message: 'Unexpected error' })
      }
  })
}