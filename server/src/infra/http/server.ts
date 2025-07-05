import fastify from "fastify";
import { fastifyCors } from "@fastify/cors";
import { validatorCompiler, serializerCompiler, hasZodFastifySchemaValidationErrors, jsonSchemaTransform } from "fastify-type-provider-zod";
import { createLinkRoute } from "./routes/create-link";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const server = fastify()

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

server.register(fastifyCors, { origin: '*' }) // allow CORS for all origins

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

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('HTTP Server Running....')
})