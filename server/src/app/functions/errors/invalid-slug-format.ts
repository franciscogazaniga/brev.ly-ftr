export class InvalidSlugFormat extends Error {
  constructor() {
    super('Invalid slug format.')
    this.name = 'InvalidSlugFormat'
  }
}