import { useEffect, useState } from 'react'

// =============================================================
// スクリーンショット表示
//
// public/ に画像を置けば自動で表示される。まだ置いていない場合、
// Works 側で「説明中心のカード」に切り替えるため、この2つの
// コンポーネントは基本的に画像がある時だけ使われる。
// 万一画像なしで直接使われた場合の保険として、小さく控えめな
// プレースホルダーを用意している（大きな空枠にはしない）。
// =============================================================

/** 画像が存在するかを確認する（読み込み失敗なら false） */
export function useImageExists(src: string): boolean | null {
  const [exists, setExists] = useState<boolean | null>(null)

  useEffect(() => {
    let alive = true
    const img = new Image()
    img.onload  = () => alive && setExists(true)
    img.onerror = () => alive && setExists(false)
    img.src = src
    return () => { alive = false }
  }, [src])

  return exists
}

/** 小さく控えめなプレースホルダー（保険用） */
function Placeholder() {
  return (
    <div className="flex items-center justify-center gap-2 py-6" aria-hidden="true">
      <span className="grid place-items-center w-7 h-7 rounded-[3px]
        border border-gold/40 text-gold font-en text-[12px]">
        F
      </span>
      <p className="font-en text-[9px] text-white/35 uppercase"
        style={{ letterSpacing: '0.28em' }}>
        Preview Soon
      </p>
    </div>
  )
}

// -------------------------------------------------------------
// PC画面（枠付き）
// -------------------------------------------------------------
export function DesktopScreen({
  src, alt, className = '',
}: { src: string; alt: string; className?: string }) {
  const exists = useImageExists(src)

  return (
    <figure
      className={`relative overflow-hidden rounded-md
        border border-white/12 bg-navy-lift ${className}`}
      style={{ boxShadow: '0 30px 70px -30px rgba(0,0,0,0.75)' }}
    >
      <span aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r
          from-transparent via-gold/50 to-transparent" />

      {exists ? (
        <img src={src} alt={alt} loading="lazy" decoding="async"
          className="block w-full h-auto" />
      ) : (
        <Placeholder />
      )}
    </figure>
  )
}

// -------------------------------------------------------------
// ブラウザ画面風のフレーム（制作実績のギャラリー用）
// 上部にブラウザのウィンドウ操作ボタン風のドットを置き、
// 「実際の画面である」ことが一目で伝わるようにする。
// -------------------------------------------------------------
export function BrowserScreen({
  src, alt, caption, className = '',
}: { src: string; alt: string; caption?: string; className?: string }) {
  const exists = useImageExists(src)

  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-md border border-white/12 bg-navy-lift"
        style={{ boxShadow: '0 24px 48px -24px rgba(0,0,0,0.7)' }}>
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10"
          aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-white/20" />
          <span className="w-2 h-2 rounded-full bg-white/20" />
          <span className="w-2 h-2 rounded-full bg-white/20" />
        </div>

        {exists ? (
          <img src={src} alt={alt} loading="lazy" decoding="async"
            className="block w-full h-auto" />
        ) : (
          <Placeholder />
        )}
      </div>

      {caption && (
        <figcaption className="mt-2.5 text-[11.5px] text-white/50">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// -------------------------------------------------------------
// スマートフォン画面（枠付き）
// -------------------------------------------------------------
export function PhoneScreen({
  src, alt, className = '',
}: { src: string; alt: string; className?: string }) {
  const exists = useImageExists(src)

  if (!exists) return null

  return (
    <figure
      className={`overflow-hidden rounded-[1.4rem] bg-navy-lift ${className}`}
      style={{
        border: '5px solid #0B1B3A',
        boxShadow: '0 24px 50px -20px rgba(0,0,0,0.8)',
      }}
    >
      <img src={src} alt={alt} loading="lazy" decoding="async"
        className="block w-full h-auto" />
    </figure>
  )
}
