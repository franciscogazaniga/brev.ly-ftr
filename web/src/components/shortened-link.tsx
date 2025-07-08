import { CopyIcon, TrashIcon } from "@phosphor-icons/react";
import { ButtonIcon } from "./ui/button-icon";
import { useLinks, type LinkProps } from "../store/links";

interface ShortenedLinkProps {
  linkId: string,
  link: LinkProps
}

export function ShortenedLink({ linkId, link }: ShortenedLinkProps) {
  const { deleteLink, copyLink } = useLinks()

  async function handleDeleteLink({ linkId, shortenedLink }: { linkId: string, shortenedLink: string }) {
    await deleteLink(linkId, shortenedLink)
  }

  async function handleCopyLink({ shortenedLink }: { shortenedLink: string }) {
    await copyLink(shortenedLink)
  }

  return (
    <div className="w-full flex flex-row items-center justify-between py-3 border-t-[1px] border-gray-200">
      <div className="flex flex-col gap-y-1">
        <a className="text-md-custom text-blue-base max-w-[150px] truncate" href={`http://localhost:5173/${link.shortenedLink}`} target="_blank" rel="noopener noreferrer">brev.ly/{link.shortenedLink}</a>
        <span className="text-sm-custom text-gray-500 max-w-[150px] truncate">{link.originalLink}</span>
      </div>

      <div className="flex flex-row items-center gap-x-4">
        <span className="text-sm-custom text-gray-500">{link.accessCounter > 1 || link.accessCounter === 0 ? link.accessCounter + " acessos" : link.accessCounter + " acesso"}</span>
        <div className="flex flex-row items-center gap-x-1">
          <ButtonIcon icon={<CopyIcon size={12} />} onClick={() => handleCopyLink({ shortenedLink: link.shortenedLink })} />
          <ButtonIcon icon={<TrashIcon size={12} />} onClick={() => handleDeleteLink({ linkId, shortenedLink: link.shortenedLink })} />
        </div>
      </div>
    </div>
  )
}