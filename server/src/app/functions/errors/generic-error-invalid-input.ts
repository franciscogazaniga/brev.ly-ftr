export class GenericErrorInvalidInput extends Error {
  constructor() {
    super('Error in one of inputs format.')
    this.name = 'GenericErrorInvalidInput'
  }
}