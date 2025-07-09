import { type Either, makeLeft, makeRight } from '@/shared/either'
import { z } from 'zod'
import { InvalidLinkFormat } from './errors/invalid-link-format'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { SlugAlreadyExists } from './errors/slug-already-exists'
import { InvalidSlugFormat } from './errors/invalid-slug-format'
import { GenericErrorInvalidInput } from './errors/generic-error-invalid-input'
import { LinkNotFound } from './errors/link-not-found'

const createLinkInput = z.object({
  originalLink: z.string().url(),
  customSlug: z.string()
  .regex(/^[a-zA-Z0-9-]+$/, {
    message: 'Informe uma url minúscula e sem espaços/caracter especial.',
  }),
})

type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink(
  input: CreateLinkInput
): Promise<Either<InvalidLinkFormat | InvalidSlugFormat | GenericErrorInvalidInput | SlugAlreadyExists, { shortenedLink: string, id: string }>> {
  const result = createLinkInput.safeParse(input)

  if (!result.success) {
    const issues = result.error.issues
    
    // return makeLeft(new GenericErrorInvalidInput(issues))
    // Verifica qual campo falhou
    const fieldErrors = issues.map(issue => issue.path[0])

    if (fieldErrors.includes('originalLink')) {
      return makeLeft(new InvalidLinkFormat())
    }

    if (fieldErrors.includes('customSlug')) {
      return makeLeft(new InvalidSlugFormat())
    }

    // fallback genérico
    return makeLeft(new GenericErrorInvalidInput())
  }

  const { originalLink, customSlug } = result.data

  // Verificar se já existe um link com esse slug
  const existingLink = await db.query.links.findFirst({
    where: (links, { eq }) => eq(links.shortenedLink, customSlug),
  })

  if (existingLink) {
    return makeLeft(new SlugAlreadyExists())
  }

  await db.insert(schema.links).values({
    originalLink: originalLink,
    shortenedLink: customSlug,
    accessCount: 0,
  })

  const newLink = await db.query.links.findFirst({
    where: (links, { eq }) => eq(links.shortenedLink, customSlug),
  })

  if (!newLink) {
    // fallback de segurança
    return makeLeft(new LinkNotFound())
  }

  const shortenedLink = `https://localhost:3333/${customSlug}`

  return makeRight({ shortenedLink, id: newLink.id })
}