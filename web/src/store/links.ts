import { create } from "zustand";
import { enableMapSet } from "immer";
import { immer } from "zustand/middleware/immer";
import { uploadLinkToStorage } from "../http/upload-link-to-storage";
import { getLinksFromStorage } from "../http/get-links-from-storage";
import { toast } from "react-toastify";
import { deleteLinkFromStorage } from "../http/delete-link-from-storage";
import { uploadCSVToStorage } from "../http/upload-csv-to-storage";
import { copyLinkToClipboard } from "../http/copy-link-to-clipboard";

export type Link = {
  linkId: string
  originalLink: string
  shortenedLink: string
  accessCounter: number
}

type LinkState = {
  links: Map<string, Link>
  isLoadingFetchLinks: boolean
  isLoadingCSV: boolean
  isLoadingLinkCreation: boolean
  error: string | null
  fieldErrors: Record<string, string>
  fetchLinks: () => Promise<void>
  createLink: (originalLink: string, slug: string) => Promise<void>
  deleteLink: (linkId: string, customSlug: string) => void
  copyLink: (shortenedLink: string) => void
  incrementAccessCounter: (linkId: string) => void
  exportLinksToCSV: (searchQuery?: string) => void
}

enableMapSet() // Enable Map and Set support in immer

export const useLinks = create<LinkState, [['zustand/immer', never]]>(
  immer((set) => ({
    links: new Map(),
    isLoadingFetchLinks: false,
    isLoadingCSV: false,
    isLoadingLinkCreation: false,
    error: null,
    fieldErrors: {},

    fetchLinks: async () => {
      set((state) => {
        state.isLoadingFetchLinks = true
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
          state.isLoadingFetchLinks = false
        })
      }
    },

    createLink: async (originalLink: string, customSlug: string) => {
      set((state) => {
        state.isLoadingLinkCreation = true
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
        const errors = err.response?.data?.errors || []

        set((state) => {
          state.error = message
          state.fieldErrors = {}

          errors.forEach((e: { field: string, message: string }) => {
            state.fieldErrors[e.field] = e.message
          })
        })

        toast.error(message)
      } finally {
        set((state) => {
          state.isLoadingLinkCreation = false
        })
      }
    },

    deleteLink: async (linkId: string, customSlug: string) => {
      const confirmed = window.confirm(`Você realmente quer apagar o link ${customSlug}?`)
      if (!confirmed) return

      try {
        await deleteLinkFromStorage({ linkId }) 
    
        set((state) => {
          state.links.delete(linkId) 
        })
      } catch (error) {
        console.error("Erro ao deletar link:", error)
      }
    },

    copyLink: async (shortenedLink: string) => {
      try {
        const successMessage = await copyLinkToClipboard(shortenedLink) 
    
        toast.info(successMessage)
      } catch (error) {
        toast.error("Erro ao deletar link.")
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
        state.isLoadingCSV = true
        state.error = null
      })
    
      try {
        await uploadCSVToStorage(searchQuery)
        // const reportUrl = await uploadCSVToStorage(searchQuery)
        // window.open(reportUrl, '_blank')
      } catch (err: any) {
        console.error(err)
        set((state) => {
          state.error = err.message || 'Erro ao exportar links.'
        })
        toast.error('Erro ao exportar links.')
      } finally {
        set((state) => {
          state.isLoadingCSV = false
        })
      }
    }
  }))
)