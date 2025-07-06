import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getOriginalLinkBySlug } from '../http/get-original-link-by-slug'
import { NotFound } from './notFound'

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

  return <div>Redirecionando...</div>
}