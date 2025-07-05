export class InvalidLinkFormat extends Error {
  constructor() {
    super('Invalid link format.')
    this.name = 'InvalidLinkFormat'
  }
}