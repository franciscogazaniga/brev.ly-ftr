import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getOriginalLinkBySlug } from '../http/get-original-link-by-slug'
import { NotFound } from './notFound'
import Logo_Icon from '../../public/Logo_Icon.svg'

export function RedirectBySlug() {
  const { slug } = useParams<{ slug: string }>()
  const [notFound, setNotFound] = useState(false)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (!slug || hasFetched.current) return

    hasFetched.current = true

    getOriginalLinkBySlug(slug).then(response => {
      const originalLink = response?.originalLink

      if (originalLink) {
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
    <main className="h-dvh flex flex-col gap-y-3 items-center justify-center p-10 bg-gray-200">
      <div className="w-full flex gap-y-5 flex-col items-center justify-center bg-gray-100 p-6 max-w-96 rounded-lg gap-y-6">
        <img src={Logo_Icon} alt="Ícone do Brev.ly, redirecionando página" />

        <span className="text-xl-custom text-gray-600">Redirecionando...</span>

        <div>
          <span className="text-md-custom text-gray-500">O link será aberto automaticamente em alguns instantes.</span>
          <span className="text-md-custom text-gray-500">Não foi redirecionado? <a className='text-blue-base' href="localhost:5173/">Acesse aqui</a></span>
        </div>
      </div>
    </main>
  )
}