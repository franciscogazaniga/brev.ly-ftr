export class SlugAlreadyExists extends Error {
  constructor() {
    super('This slug already exists.')
    this.name = 'SlugAlreadyExists'
  }
}