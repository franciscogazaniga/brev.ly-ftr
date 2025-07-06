import axios from "axios"

interface LinkFromAPI {
  id: string
  originalLink: string
  customSlug: string
  amountAccess: number
}

export async function getLinksFromStorage() {
  const response = await axios.get<{ links: LinkFromAPI[] }>("http://localhost:3333/links")

  return response.data.links.map((link) => ({
    id: link.id,
    originalLink: link.originalLink,
    shortenedLink: link.customSlug,
    accessCounter: link.amountAccess,
  }))
}