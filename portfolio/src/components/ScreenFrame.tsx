import { useEffect, useState } from 'react'

// =============================================================
// スクリーンショット表示
//
// public/ に画像を置けば自動で表示され、無ければワイヤーフレームで
// レイアウトが成立する。実在しない機能や架空の画面は作らず、
// 中立的な枠・行・ラベルのみで構成する。
// =============================================================

/** 画像が存在するかを確認する（読み込み失敗ならワイヤーフレームへ） */
function useImageExists(src: string): boolean | null {
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

// -------------------------------------------------------------
// ワイヤーフレーム（PC）
// -------------------------------------------------------------
function WireDesktop() {
  return (
    <div className="aspect-[16/10] p-5 sm:p-7 flex flex-col gap-4" aria-hidden="true">
      {/* 見出し行と操作 */}
      <div className="flex items-center justify-between">
        <span className="h-2.5 w-28 rounded-sm bg-white/16" />
        <span className="flex gap-2">
          <span className="h-6 w-14 rounded-sm bg-white/8" />
          <span className="h-6 w-16 rounded-sm bg-gold/25" />
        </span>
      </div>

      {/* 検索行 */}
      <span className="h-8 rounded-sm bg-white/6 border border-white/10" />

      {/* 一覧 */}
      <div className="flex-1 flex flex-col gap-2.5">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i}
            className="flex items-center gap-3 rounded-sm border border-white/8
              bg-white/[0.03] px-3 py-3">
            <span className={`w-1 h-6 rounded-full shrink-0
              ${i === 1 ? 'bg-gold/70' : 'bg-white/15'}`} />
            <span className="flex-1 flex flex-col gap-1.5">
              <span className="h-2 rounded-sm bg-white/14"
                style={{ width: `${70 - i * 7}%` }} />
              <span className="h-1.5 rounded-sm bg-white/8"
                style={{ width: `${46 - i * 5}%` }} />
            </span>
            <span className="h-4 w-12 rounded-sm bg-white/8 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// ワイヤーフレーム（スマートフォン）
// -------------------------------------------------------------
function WirePhone() {
  return (
    <div className="aspect-[9/19] p-3 flex flex-col gap-2.5" aria-hidden="true">
      <span className="h-2 w-14 rounded-sm bg-white/16" />
      <span className="h-6 rounded-sm bg-white/6 border border-white/10" />
      {[0, 1, 2, 3].map(i => (
        <div key={i}
          className="rounded-sm border border-white/8 bg-white/[0.03] px-2.5 py-2.5
            flex flex-col gap-1.5">
          <span className="flex items-center gap-2">
            <span className={`w-0.5 h-4 rounded-full shrink-0
              ${i === 0 ? 'bg-gold/70' : 'bg-white/15'}`} />
            <span className="h-1.5 flex-1 rounded-sm bg-white/14" />
          </span>
          <span className="h-1.5 w-2/3 ml-2.5 rounded-sm bg-white/8" />
        </div>
      ))}
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
      {/* 上端のゴールドライン（額装） */}
      <span aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r
          from-transparent via-gold/50 to-transparent" />

      {exists ? (
        <img src={src} alt={alt} loading="lazy" decoding="async"
          className="block w-full h-auto" />
      ) : (
        <WireDesktop />
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

  return (
    <figure
      className={`overflow-hidden rounded-[1.4rem] bg-navy-lift ${className}`}
      style={{
        border: '5px solid #0B1B3A',
        boxShadow: '0 24px 50px -20px rgba(0,0,0,0.8)',
      }}
    >
      {exists ? (
        <img src={src} alt={alt} loading="lazy" decoding="async"
          className="block w-full h-auto" />
      ) : (
        <WirePhone />
      )}
    </figure>
  )
}
