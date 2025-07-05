import { type Either, makeLeft, makeRight } from '@/shared/either'
import { z } from 'zod'
import { InvalidLinkFormat } from './errors/invalid-link-format'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { SlugAlreadyExists } from './errors/slug-already-exists'
import { InvalidSlugFormat } from './errors/invalid-slug-format'
import { GenericErrorInvalidInput } from './errors/generic-error-invalid-input'

const createLinkInput = z.object({
  originalLink: z.string().url(),
  customSlug: z.string().min(3)
  .max(50)
  .regex(/^[a-zA-Z0-9-]+$/, {
    message: 'A slug só pode conter letras, números e hífens.',
  }),
})

type CreateLinkInput = z.input<typeof createLinkInput>

export async function createLink(
  input: CreateLinkInput
): Promise<Either<InvalidLinkFormat | InvalidSlugFormat | GenericErrorInvalidInput | SlugAlreadyExists, { shortenedLink: string }>> {
  const result = createLinkInput.safeParse(input)

  if (!result.success) {
    const issues = result.error.issues
    
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
  })

  const shortenedLink = `https://localhost:3333/${customSlug}`

  return makeRight({ shortenedLink })
}