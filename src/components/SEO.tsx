import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://cratery.cratera.org'
const SITE_NAME = 'Cratery'
const DEFAULT_TITLE = 'Cratery: Master Rust Through Interactive Quests'
const DEFAULT_DESCRIPTION =
  'Interactive Rust programming quiz platform with 100+ quests covering ownership, lifetimes, traits, concurrency, and more. Master Rust through hands-on challenges.'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export interface SEOProps {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'article'
  noIndex?: boolean
  
  structuredData?: Record<string, unknown> | Record<string, unknown>[]
  
  publishedTime?: string
  
  author?: string
}


export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
  structuredData,
  publishedTime,
  author,
}: SEOProps) {
  const { pathname } = useLocation()
  const managedTagsRef = useRef<HTMLElement[]>([])

  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  const canonicalUrl = `${SITE_URL}${pathname}`

  useEffect(() => {
    
    document.title = fullTitle

    
    managedTagsRef.current.forEach((el) => el.remove())
    managedTagsRef.current = []

    
    const removeDuplicate = (selector: string) => {
      const existing = document.head.querySelector(selector)
      if (existing && !managedTagsRef.current.includes(existing as HTMLElement)) {
        existing.remove()
      }
    }

    const addMeta = (attrs: Record<string, string>) => {
      
      if (attrs.name) removeDuplicate(`meta[name="${attrs.name}"]`)
      if (attrs.property) removeDuplicate(`meta[property="${attrs.property}"]`)

      const tag = document.createElement('meta')
      Object.entries(attrs).forEach(([k, v]) => tag.setAttribute(k, v))
      document.head.appendChild(tag)
      managedTagsRef.current.push(tag)
    }

    const addLink = (attrs: Record<string, string>) => {
      if (attrs.rel) removeDuplicate(`link[rel="${attrs.rel}"]`)
      const tag = document.createElement('link')
      Object.entries(attrs).forEach(([k, v]) => tag.setAttribute(k, v))
      document.head.appendChild(tag)
      managedTagsRef.current.push(tag)
    }

    
    addMeta({ name: 'description', content: description })

    
    addLink({ rel: 'canonical', href: canonicalUrl })

    
    if (noIndex) {
      addMeta({ name: 'robots', content: 'noindex, nofollow' })
    }

    
    addMeta({ property: 'og:title', content: fullTitle })
    addMeta({ property: 'og:description', content: description })
    addMeta({ property: 'og:url', content: canonicalUrl })
    addMeta({ property: 'og:type', content: type })
    addMeta({ property: 'og:image', content: image })
    addMeta({ property: 'og:image:secure_url', content: image })
    addMeta({ property: 'og:image:type', content: 'image/png' })
    addMeta({ property: 'og:image:width', content: '1200' })
    addMeta({ property: 'og:image:height', content: '630' })
    addMeta({ property: 'og:image:alt', content: fullTitle })
    addMeta({ property: 'og:site_name', content: SITE_NAME })
    addMeta({ property: 'og:locale', content: 'en_US' })

    
    if (type === 'article') {
      if (publishedTime) {
        addMeta({ property: 'article:published_time', content: publishedTime })
      }
      if (author) {
        addMeta({ property: 'article:author', content: author })
      }
    }

    
    addMeta({ name: 'twitter:card', content: 'summary_large_image' })
    addMeta({ name: 'twitter:title', content: fullTitle })
    addMeta({ name: 'twitter:description', content: description })
    addMeta({ name: 'twitter:image', content: image })
    addMeta({ name: 'twitter:image:alt', content: fullTitle })

    
    if (structuredData) {
      const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData]
      dataArray.forEach((data, i) => {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.textContent = JSON.stringify(data)
        script.setAttribute('data-seo-managed', `ld-${i}`)
        document.head.appendChild(script)
        managedTagsRef.current.push(script)
      })
    }

    return () => {
      managedTagsRef.current.forEach((el) => el.remove())
      managedTagsRef.current = []
    }
  }, [fullTitle, description, canonicalUrl, image, type, noIndex, structuredData, publishedTime, author])

  return null
}
