import { useEffect, useState } from 'react'

// =============================================================
// スクリーンショットの存在確認
// public/ に画像を置けば自動で切り替わり、なければワイヤーフレーム表示
// =============================================================
function useImageExists(src: string) {
  const [exists, setExists] = useState<boolean | null>(null)

  useEffect(() => {
    let alive = true
    const img = new Image()
    img.onload  = () => { if (alive) setExists(true) }
    img.onerror = () => { if (alive) setExists(false) }
    img.src = src
    return () => { alive = false }
  }, [src])

  return exists
}

// =============================================================
// ワイヤーフレーム（中立的な枠・行・カードのみ。架空の画面は作らない）
// =============================================================
function WireDesktop() {
  return (
    <div className="p-4 sm:p-5" aria-hidden="true">
      {/* 上部：見出し行と操作行 */}
      <div className="flex items-center justify-between mb-4">
        <div className="wire-row w-24 sm:w-32" />
        <div className="flex gap-2">
          <div className="wire-row w-12 h-6 rounded" />
          <div className="w-16 h-6 rounded bg-navy/12" />
        </div>
      </div>

      {/* 検索行 */}
      <div className="wire-block h-8 mb-4" />

      {/* 一覧行 */}
      <div className="space-y-2.5">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="wire-block px-3 py-3 flex items-center gap-3">
            <div className={`w-1.5 h-6 rounded-full shrink-0
              ${i === 0 ? 'bg-accent/50' : 'bg-surface-line'}`} />
            <div className="flex-1 space-y-1.5">
              <div className="wire-row" style={{ width: `${72 - i * 8}%` }} />
              <div className="wire-row h-1.5" style={{ width: `${48 - i * 6}%` }} />
            </div>
            <div className="w-10 h-4 rounded-sm bg-surface-line shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}

function WirePhone() {
  return (
    <div className="p-3" aria-hidden="true">
      <div className="wire-row w-16 mb-3" />
      <div className="wire-block h-6 mb-3" />
      <div className="space-y-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="wire-block px-2.5 py-2.5 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className={`w-1 h-4 rounded-full shrink-0
                ${i === 0 ? 'bg-accent/50' : 'bg-surface-line'}`} />
              <div className="wire-row flex-1" />
            </div>
            <div className="wire-row h-1.5 w-2/3 ml-3" />
          </div>
        ))}
      </div>
    </div>
  )
}

// =============================================================
// ブラウザ枠のモックアップ
// =============================================================
export function BrowserMock({
  src, alt, className = '',
}: { src: string; alt: string; className?: string }) {
  const exists = useImageExists(src)

  return (
    <figure className={`mock-browser ${className}`}>
      {/* ブラウザのバー */}
      <div className="mock-bar">
        <span className="mock-dot" />
        <span className="mock-dot" />
        <span className="mock-dot" />
        <span className="ml-2 h-3.5 flex-1 max-w-[55%] rounded-full bg-white
          border border-surface-line" />
      </div>

      {/* 中身：画像があれば表示、なければワイヤーフレーム */}
      {exists ? (
        <img src={src} alt={alt} loading="lazy" decoding="async"
          className="block w-full h-auto" />
      ) : (
        <WireDesktop />
      )}
    </figure>
  )
}

// =============================================================
// スマートフォン枠のモックアップ
// =============================================================
export function PhoneMock({
  src, alt, className = '',
}: { src: string; alt: string; className?: string }) {
  const exists = useImageExists(src)

  return (
    <figure className={`mock-phone ${className}`}>
      {exists ? (
        <img src={src} alt={alt} loading="lazy" decoding="async"
          className="block w-full h-auto" />
      ) : (
        <WirePhone />
      )}
    </figure>
  )
}
