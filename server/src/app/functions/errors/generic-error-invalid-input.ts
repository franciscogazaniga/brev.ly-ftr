import { z } from 'zod'

export class GenericErrorInvalidInput extends Error {
  public issues: z.ZodIssue[]

  constructor(issues: z.ZodIssue[]) {
    super("Erro de validação nos campos")
    this.name = 'InvalidInputFormat'
    this.issues = issues
  }
}