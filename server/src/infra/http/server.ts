import fastify from "fastify";
import { fastifyCors } from "@fastify/cors";
import { validatorCompiler, serializerCompiler, hasZodFastifySchemaValidationErrors, jsonSchemaTransform, ZodTypeProvider } from "fastify-type-provider-zod";
import { createLinkRoute } from "./routes/create-link";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { getLinksRoute } from "./routes/get-links";
import { getOriginalLinkBySlug } from "./routes/get-original-link-by-slug";
import { deleteLinkRoute } from "./routes/delete-link";

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(401).send({
      message: 'Validation error',
      issues: error.validation,
    })
  }

  // Envia o erro para alguma ferramenta de observabilidade (Sentry/Datadog/Grafana/OTel)
  console.error(error)

  return reply.status(500).send({ message: 'Internal server error' })
})

server.register(fastifyCors, { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], },) // allow CORS for all origins

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev.ly ',
      version: '1.0.0',
    },
  },
  // transform: jsonSchemaTransform, // transform the structure schema of route create-link in the structure of swagger
  // transformer: 'generic',
})

server.register(fastifySwaggerUi, { routePrefix: '/docs' })

server.register(createLinkRoute)
server.register(deleteLinkRoute)
server.register(getLinksRoute)
server.register(getOriginalLinkBySlug)

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP Server Running....')
})