import { DownloadSimpleIcon, LinkIcon } from "@phosphor-icons/react";
import { ButtonDownloadCSV } from "./ui/button-download-csv";
import { ShortenedLink } from "./shortened-link";
import { useLinks } from "../store/links";
import { useEffect } from "react";

export function MyLinks() {
  const links = useLinks((state) => state.links)
  const fetchLinks = useLinks((state) => state.fetchLinks)
  // const isLoading = useLinks((state) => state.isLoading)
  // const error = useLinks((state) => state.error)

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  const linkList = Array.from(links.values())

  return (
    <div className="w-full flex gap-y-5 flex-col justify-center bg-gray-100 p-6 max-w-96 rounded-lg">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-lg-custom">Meus links</h1>
        <ButtonDownloadCSV icon={<DownloadSimpleIcon size={16} weight="regular" />}>Baixar CSV</ButtonDownloadCSV>
      </div>


      {linkList.length > 0 ? (
        linkList.map(({ shortenedLink, originalLink, accessCounter, linkId }) => (
          <ShortenedLink
            key={linkId}
            linkId={linkId}
            shortenedLink={shortenedLink}
            originalLink={originalLink}
            accessCounter={accessCounter}
          />
        )
        )) : (
        <div className="flex items-center justify-center flex-col gap-y-3 border-t-[1px] border-gray-200 p-6">
          <span className="text-gray-600"><LinkIcon size={32} /></span>
          <span className="text-xs-custom">Ainda não existem links cadastrados</span>
        </div>
      )}
    </div>
  )
}