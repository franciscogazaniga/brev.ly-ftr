import { CopyIcon, TrashIcon } from "@phosphor-icons/react";
import { ButtonIcon } from "./ui/button-icon";
import { Link } from "react-router-dom";
import { useLinks } from "../store/links";

interface ShortenedLinkProps {
  linkId: string,
  shortenedLink: string,
  originalLink: string,
  accessCounter: number,
}

export function ShortenedLink({ linkId, shortenedLink, originalLink, accessCounter }: ShortenedLinkProps) {
  const { deleteLink } = useLinks()

  async function handleDeleteLink({ linkId }: { linkId: string }) {
    await deleteLink(linkId)
  }

  return (
    <div className="w-full flex flex-row items-center justify-between py-3 border-t-[1px] border-gray-200">
      <div className="flex flex-col gap-y-1">
        <Link className="text-md-custom text-blue-base" to={`/${shortenedLink}`}>{shortenedLink}</Link>
        {/* <a className="text-md-custom text-blue-base" href={`http://localhost:5173/${shortenedLink}`} target="_blank" rel="noopener noreferrer">{shortenedLink}</a> */}
        <span className="text-sm-custom text-gray-500">{originalLink}</span>
      </div>

      <div>
        <span className="text-sm-custom text-gray-500">{accessCounter > 1 ? accessCounter + " acessos" : accessCounter + " acesso"}</span>
      </div>

      <div className="flex flex-row items-center gap-x-1">
        <ButtonIcon icon={<CopyIcon size={12} />} />
        <ButtonIcon icon={<TrashIcon size={12} />} onClick={() => handleDeleteLink({ linkId })} />
      </div>
    </div>
  )
}