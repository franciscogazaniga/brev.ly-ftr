import { create } from "zustand";
import { enableMapSet } from "immer";
import { immer } from "zustand/middleware/immer";
import { uploadLinkToStorage } from "../http/upload-link-to-storage";
import { getLinksFromStorage } from "../http/get-links-from-storage";
import { toast } from "react-toastify";
import { deleteLinkFromStorage } from "../http/delete-link-from-storage";
import { uploadCSVToStorage } from "../http/upload-csv-to-storage";

export type Link = {
  linkId: string
  originalLink: string
  shortenedLink: string
  accessCounter: number
}

type LinkState = {
  links: Map<string, Link>
  isLoading: boolean
  error: string | null
  fetchLinks: () => Promise<void>
  createLink: (originalLink: string, slug: string) => Promise<void>
  deleteLink: (linkId: string) => void
  incrementAccessCounter: (linkId: string) => void
  exportLinksToCSV: (searchQuery?: string) => void
}

enableMapSet() // Enable Map and Set support in immer

export const useLinks = create<LinkState, [['zustand/immer', never]]>(
  immer((set) => ({
    links: new Map(),
    isLoading: false,
    error: null,

    fetchLinks: async () => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })
    
      try {
        const linksFromAPI = await getLinksFromStorage()
    
        set((state) => {
          const newMap = new Map()
          linksFromAPI.forEach((link) => {
            newMap.set(link.id, {
              linkId: link.id,
              originalLink: link.originalLink,
              shortenedLink: link.shortenedLink,
              accessCounter: link.accessCounter,
            })
          })
    
          state.links = newMap
        })
      } catch (err: any) {
        set((state) => {
          state.error = err.response?.data?.message || "Erro ao buscar links"
        })
      } finally {
        set((state) => {
          state.isLoading = false
        })
      }
    },

    createLink: async (originalLink: string, customSlug: string) => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const { linkId } = await uploadLinkToStorage({originalLink, customSlug})

        set((state) => {
          state.links.set(linkId, {
            linkId,
            originalLink,
            shortenedLink: customSlug,
            accessCounter: 0,
          })
        })
      } catch (err: any) {
        const message = err.response?.data?.message || 'Erro ao criar link'

        set((state) => {
          state.error = message
        })

        toast.error(message)
      } finally {
        set((state) => {
          state.isLoading = false
        })
      }
    },

    deleteLink: async (linkId: string) => {
      try {
        await deleteLinkFromStorage({ linkId }) // Chamada HTTP
    
        set((state) => {
          state.links.delete(linkId) // Atualiza o estado local
        })
      } catch (error) {
        console.error("Erro ao deletar link:", error)
        // Aqui você pode adicionar lógica de fallback, exibir toast, etc.
      }
    },

    incrementAccessCounter: (linkId: string) => {
      set((state) => {
        const link = state.links.get(linkId)
        if (link) {
          state.links.set(linkId, {
            ...link,
            accessCounter: link.accessCounter + 1,
          })
        }
      })
    },

    exportLinksToCSV: async (searchQuery?: string) => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })
    
      try {
        const reportUrl = await uploadCSVToStorage(searchQuery)
    
        toast.success('CSV exportado com sucesso!')
        window.open(reportUrl, '_blank')
      } catch (err: any) {
        console.error(err)
        set((state) => {
          state.error = err.message || 'Erro ao exportar links.'
        })
        toast.error('Erro ao exportar links.')
      } finally {
        set((state) => {
          state.isLoading = false
        })
      }
    }
  }))
)