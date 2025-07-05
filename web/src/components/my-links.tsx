import { DownloadSimpleIcon, LinkIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { ButtonDownloadCSV } from "./ui/button-download-csv";
import { Input } from "./ui/input";
import { ShortenedLink } from "./shortened-link";

export function MyLinks() {
  return (
    <div className="w-full flex gap-y-5 flex-col justify-center bg-gray-100 p-6 max-w-96 rounded-lg">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-lg-custom">Meus links</h1>
        <ButtonDownloadCSV icon={<DownloadSimpleIcon size={16} weight="regular" />}>Baixar CSV</ButtonDownloadCSV>
      </div>

      <ShortenedLink shortenedLink="teste" originalLink="https://google.com.br" />
      <ShortenedLink shortenedLink="teste" originalLink="https://google.com.br" />
      <ShortenedLink shortenedLink="teste" originalLink="https://google.com.br" />

      {/* <div className="flex items-center justify-center flex-col gap-y-3 border-t-[1px] border-gray-200 p-6">
        <span className="text-gray-600"><LinkIcon size={32} /></span>
        <span className="text-xs-custom">Ainda não existem links cadastrados</span>
      </div> */}
    </div>
  )
}