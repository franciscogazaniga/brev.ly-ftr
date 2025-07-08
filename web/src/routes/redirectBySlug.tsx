import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getOriginalLinkBySlug } from '../http/get-original-link-by-slug'
import { NotFound } from './notFound'
import Logo_Icon from '../../public/Logo_Icon.svg'
import { useLinks } from '../store/links'

export function RedirectBySlug() {
  const { slug } = useParams<{ slug: string }>()
  const [notFound, setNotFound] = useState(false)
  const { incrementAccessCounter } = useLinks()
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!slug || hasFetched.current) return

    hasFetched.current = true

    const bc = new BroadcastChannel("link-accessed");

    getOriginalLinkBySlug(slug).then(async response => {
      const originalLink = response?.originalLink
      const linkId = response?.linkId

      if (originalLink && linkId) {
        await incrementAccessCounter(linkId)

        bc.postMessage({ type: "link-accessed", linkId })
        window.location.href = originalLink
      } else {
        setNotFound(true)
      }
    })
  }, [slug])

  if (notFound) {
    return <NotFound />
  }

  return (
    <main className="h-dvh flex flex-col gap-y-3 items-center justify-center bg-gray-200 px-3">
      <div className="w-full flex flex-col items-center justify-center bg-gray-100 max-w-[580px] rounded-lg gap-y-6 py-16 px-12">
        <img src={Logo_Icon} alt="Ícone do Brev.ly, redirecionando página" />

        <span className="text-xl-custom text-gray-600">Redirecionando...</span>

        <div className='text-center flex flex-col'>
          <span className="text-md-custom text-gray-500">O link será aberto automaticamente em alguns instantes.</span>
          <span className="text-md-custom text-gray-500">Não foi redirecionado? <a className='text-blue-base underline' href="/">Acesse aqui</a></span>
        </div>
      </div>
    </main>
  )
}