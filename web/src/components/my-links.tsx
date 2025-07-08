import { DownloadSimpleIcon, LinkIcon } from "@phosphor-icons/react";
import { ButtonDownloadCSV } from "./ui/button-download-csv";
import { ShortenedLink } from "./shortened-link";
import { useLinks } from "../store/links";
import { useEffect } from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";

export function MyLinks() {
  const fetchLinks = useLinks((state) => state.fetchLinks)
  const exportLinksToCSV = useLinks((state) => state.exportLinksToCSV)
  const { isLoadingFetchLinks, isLoadingCSV, links } = useLinks()
  const isLinksListEmpty = links.size === 0

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  const linkList = Array.from(links.values())

  return (
    <div className="w-full flex gap-y-5 flex-col justify-center md:justify-start bg-gray-100 p-6 max-w-96 md:max-w-md md:min-h-96 rounded-lg p-6">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-lg-custom">Meus links</h1>
        <ButtonDownloadCSV onClick={() => exportLinksToCSV()} icon={<DownloadSimpleIcon size={16} weight="regular" />} isLoading={isLoadingCSV}>Baixar CSV</ButtonDownloadCSV>
      </div>

      {isLoadingFetchLinks ? (
        <div className="flex items-center justify-center flex-col gap-y-3 border-t-[1px] border-gray-200 p-6">
          <span className="loader w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
          <span className="text-xs-custom">Carregando links...</span>
        </div>
      ) : isLinksListEmpty ? (
        <div className="flex items-center justify-center flex-col gap-y-3 border-t-[1px] border-gray-200 p-6">
          <span className="text-gray-600"><LinkIcon size={32} /></span>
          <span className="text-xs-custom">Ainda não existem links cadastrados</span>
        </div>
      ) : (
        <ScrollArea.Root type="scroll" className="h-[200px] w-full overflow-hidden rounded-lg">
          <ScrollArea.Viewport className="h-full w-full">
            {linkList.map(({ shortenedLink, originalLink, accessCounter, linkId }) => (
              <ShortenedLink
                key={linkId}
                linkId={linkId}
                shortenedLink={shortenedLink}
                originalLink={originalLink}
                accessCounter={accessCounter}
              />
            ))
            }
          </ScrollArea.Viewport>

          <ScrollArea.Scrollbar
            className="flex select-none touch-none bg-blue-base p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="relative flex-1 bg-blue-dark rounded-[10px] before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      )}
    </div>
  )
}