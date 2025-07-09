export class GenericErrorInvalidInput extends Error {
  constructor() {
    super("Erro de validação nos campos")
    this.name = 'InvalidInputFormat'
  }
}