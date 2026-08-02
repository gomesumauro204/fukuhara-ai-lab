import { useEffect, useState } from 'react'
import { NAV, CONTACT, BOOKING } from '../data/site'
import Logo from './Logo'
import { IconMail, IconArrow } from './ui'

export default function Header() {
  const [open, setOpen] = useState(false)

  // メニューを開いている間だけ背面スクロールを止める
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Escape で閉じる
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // ページ内移動はブラウザ標準のアンカー遷移に任せ、メニューを閉じるだけ
  const close = () => setOpen(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-navy/95 backdrop-blur-md
      border-b border-white/8">
      <div className="max-w-content mx-auto px-5 sm:px-8 lg:px-12
        h-14 sm:h-16 flex items-center justify-between gap-4">

        <a href="#top" onClick={close} aria-label="ページ先頭へ">
          <Logo emphasize />
        </a>

        {/* PCナビ */}
        <nav className="hidden lg:flex items-center gap-7"
          aria-label="サイト内ナビゲーション">
          {NAV.map(item => (
            <a key={item.href} href={item.href}
              className="text-[12.5px] font-semibold text-white/70
                hover:text-white transition-colors whitespace-nowrap">
              {item.label}
            </a>
          ))}

          <a href={BOOKING.url} target="_blank" rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full
              border border-gold/55 px-5 py-2.5 text-[12.5px] font-semibold
              text-gold hover:border-gold hover:bg-gold/[0.07] transition-colors">
            <span className="w-1 h-1 rounded-full bg-gold" aria-hidden="true" />
            {BOOKING.labelShort}
          </a>
        </nav>

        {/* ハンバーガー */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
          className="lg:hidden -mr-2 p-2 text-white"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {open ? (
              <>
                <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1="3" y1="7"  x2="19" y2="7"  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="3" y1="15" x2="19" y2="15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* スマホメニュー */}
      {open && (
        <div id="mobile-menu"
          className="lg:hidden bg-navy border-t border-white/8
            max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <nav className="px-5 pt-2" aria-label="サイト内ナビゲーション">
            {NAV.map(item => (
              <a key={item.href} href={item.href} onClick={close}
                className="flex items-center justify-between py-4
                  border-b border-white/8 text-[15px] font-semibold text-white">
                {item.label}
                <IconArrow className="text-white/30" />
              </a>
            ))}
          </nav>

          <div className="px-5 py-6 space-y-3">
            <a href="#works" onClick={close}
              className="flex items-center justify-center w-full py-3.5 rounded-full
                border border-white/25 text-white font-semibold text-[13.5px]">
              制作実績を見る
            </a>
            <a href={BOOKING.url} target="_blank" rel="noopener noreferrer" onClick={close}
              className="flex items-center justify-center w-full py-3.5 rounded-full
                bg-gold text-navy-deep font-bold text-[13.5px]">
              無料相談を予約する
            </a>
            <a href={CONTACT.mailto} onClick={close}
              className="flex items-center justify-center gap-2 w-full py-3
                text-white/60 font-semibold text-[13px]">
              <IconMail />
              メールで問い合わせる
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
