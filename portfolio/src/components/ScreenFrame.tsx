import { useEffect, useState } from 'react'

// =============================================================
// スクリーンショット表示
//
// public/ に画像を置けば自動で表示される。まだ置いていない場合は、
// 偽のUIを模したワイヤーフレームではなく、ブランドの一部として
// 成立する上品なプレースホルダーを表示する（「未完成」に見せない）。
// =============================================================

/** 画像が存在するかを確認する（読み込み失敗ならプレースホルダーへ） */
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
// プレースホルダー（画像未配置時）
// ダミーのUI線ではなく、ロゴマーク＋ラベルのみで静かに成立させる
// -------------------------------------------------------------
function Placeholder({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`aspect-[16/10] flex flex-col items-center justify-center gap-3
        ${compact ? 'gap-2' : 'gap-3'}`}
      aria-hidden="true"
    >
      <span className={`grid place-items-center rounded-[3px] border border-gold/40
        text-gold font-en ${compact ? 'w-7 h-7 text-[13px]' : 'w-11 h-11 text-[18px]'}`}>
        F
      </span>
      {!compact && (
        <p className="font-en text-[9.5px] text-white/35 uppercase"
          style={{ letterSpacing: '0.3em' }}>
          Screenshot Coming Soon
        </p>
      )}
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
        <Placeholder />
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
        <div className="aspect-[9/19]">
          <Placeholder compact />
        </div>
      )}
    </figure>
  )
}
