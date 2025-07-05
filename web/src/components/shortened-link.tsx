import { CopyIcon, TrashIcon } from "@phosphor-icons/react";
import { ButtonIcon } from "./ui/button-icon";

interface ShortenedLinkProps {
  shortenedLink: string,
  originalLink: string,
}

export function ShortenedLink({ shortenedLink, originalLink }: ShortenedLinkProps) {
  return (
    <div className="w-full flex flex-row items-center justify-between py-3 border-t-[1px] border-gray-200">
      <div className="flex flex-col gap-y-1">
        <a className="text-md-custom text-blue-base">brev.ly/{shortenedLink}</a>
        <span className="text-sm-custom text-gray-500">{originalLink}</span>
      </div>

      <div>
        <span className="text-sm-custom text-gray-500">30 acessos</span>
      </div>

      <div className="flex flex-row items-center gap-x-1">
        <ButtonIcon icon={<CopyIcon size={12} />} />
        <ButtonIcon icon={<TrashIcon size={12} />} />
      </div>
    </div>
  )
}