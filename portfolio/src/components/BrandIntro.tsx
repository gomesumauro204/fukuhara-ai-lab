import { useEffect, useState } from 'react'
import { SITE } from '../data/site'

const SEEN_KEY = 'fal_intro_seen'

/**
 * 初回アクセス時のみ表示する短いブランド表示（約1秒）。
 *
 * - Hero は背後ですでに描画済み。読み込みを待たせるものではない。
 * - 同一セッション中は sessionStorage で再表示しない。
 * - 動きを減らす設定では表示しない（CSS 側でも二重に無効化）。
 */
export default function BrandIntro() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || sessionStorage.getItem(SEEN_KEY)) return

    sessionStorage.setItem(SEEN_KEY, '1')
    setShow(true)

    const timer = setTimeout(() => setShow(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="brand-intro" aria-hidden="true">
      <p className="brand-intro-mark font-en text-[11px] sm:text-[13px]
        uppercase text-gold">
        {SITE.nameEn}
      </p>
    </div>
  )
}
