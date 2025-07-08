export class SlugAlreadyExists extends Error {
  constructor() {
    super('Essa URL encurtada já existe.')
    this.name = 'SlugAlreadyExists'
  }
}