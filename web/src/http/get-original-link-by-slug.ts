import axios from 'axios'

interface OriginalLinkResponse {
  linkId: string
  originalLink: string
}

export async function getOriginalLinkBySlug(customSlug: string): Promise<OriginalLinkResponse | null> {
  try {
    const response = await axios.get<OriginalLinkResponse>(`http://localhost:3333/${customSlug}`)

    console.log("Response from API2:", response.data)

    return response.data
  } catch (error) {
    // pode lançar erro ou retornar null, dependendo da sua escolha
    return null
  }
}