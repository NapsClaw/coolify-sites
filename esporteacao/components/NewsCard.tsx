import Link from 'next/link'
import Image from 'next/image'
import { formatDateShort } from '@/lib/utils'

interface NewsCardProps {
  id: string
  title: string
  slug: string
  summary?: string
  cover_url?: string
  category?: { name: string; slug: string; color?: string }
  published_at?: string
  created_at: string
  size?: 'sm' | 'md' | 'lg'
}

export default function NewsCard({
  title, slug, summary, cover_url, category, published_at, created_at, size = 'md'
}: NewsCardProps) {
  const date = published_at || created_at

  if (size === 'lg') {
    return (
      <Link href={`/noticia/${slug}`} className="group block relative rounded-xl overflow-hidden bg-[#1e3a5f] shadow-lg h-[420px]">
        {cover_url && (
          <Image
            src={cover_url}
            alt={title}
            fill
            className="object-cover opacity-50 group-hover:opacity-60 transition-opacity"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        )}
        {!cover_url && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#0a1929]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {category && (
            <span className="inline-block bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded mb-2 uppercase tracking-wide">
              {category.name}
            </span>
          )}
          <h2 className="text-white text-2xl font-black leading-tight line-clamp-3 group-hover:text-blue-200 transition-colors">
            {title}
          </h2>
          <p className="text-gray-300 text-sm mt-2">{formatDateShort(date)}</p>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/noticia/${slug}`} className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {cover_url ? (
        <div className="relative h-48 w-full">
          <Image
            src={cover_url}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-[#1e3a5f] to-[#243b53] flex items-center justify-center">
          <span className="text-5xl font-black text-white/20 italic">EA</span>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        {category && (
          <span className="text-blue-600 text-xs font-bold uppercase tracking-wide mb-1">
            {category.name}
          </span>
        )}
        <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#1e3a5f] transition-colors flex-1">
          {title}
        </h3>
        {summary && (
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">{summary}</p>
        )}
        <p className="text-gray-400 text-xs mt-3">{formatDateShort(date)}</p>
      </div>
    </Link>
  )
}
