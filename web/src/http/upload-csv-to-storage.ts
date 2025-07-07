import axios from 'axios'

export async function uploadCSVToStorage(searchQuery?: string) {
  const response = await axios.post<{ reportUrl: string }>(
    'http://localhost:3333/links/exports',
    undefined,
    {
      params: searchQuery ? { searchQuery } : undefined,
    }
  )

  return response.data.reportUrl
}