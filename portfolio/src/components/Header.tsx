import { useEffect, useState } from 'react'
import { SITE, NAV, CONTACT, BOOKING } from '../data/site'
import { BookingButton, IconMail, IconArrowRight } from './ui'

export default function Header() {
  const [open, setOpen] = useState(false)

  // メニューを開いている間だけ背面スクロールを止める
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  /**
   * メニュー内のリンクを押したときの処理。
   * ページ内移動はブラウザ標準のアンカー遷移に任せ、
   * ここではメニューを閉じるだけにする。
   */
  function handleNavClick() {
    setOpen(false)
  }

  // Escape でメニューを閉じる
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-surface-line">
      <div className="max-w-content mx-auto px-5 sm:px-8 lg:px-12
        h-14 sm:h-16 flex items-center justify-between gap-4">

        {/* ロゴ */}
        <a href="#top" className="flex flex-col leading-none shrink-0"
          onClick={() => setOpen(false)}>
          <span className="text-[15px] sm:text-base font-bold text-navy tracking-tight">
            {SITE.name}
          </span>
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em]
            text-ink-light mt-0.5">
            {SITE.nameEn}
          </span>
        </a>

        {/* PCナビ */}
        <nav className="hidden lg:flex items-center gap-6"
          aria-label="サイト内ナビゲーション">
          {NAV.map(item => (
            <a key={item.href} href={item.href}
              className="text-[13px] font-semibold text-ink-mid
                hover:text-navy transition-colors whitespace-nowrap">
              {item.label}
            </a>
          ))}
          <BookingButton variant="compact" label={BOOKING.labelShort} />
        </nav>

        {/* ハンバーガー */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
          className="lg:hidden -mr-2 p-2 text-navy"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" />
                <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" />
                <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" />
                <line x1="4" y1="17" x2="20" y2="17" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* スマホメニュー */}
      {open && (
        <div id="mobile-menu"
          className="lg:hidden bg-white border-t border-surface-line
            max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <nav className="px-5 py-2" aria-label="サイト内ナビゲーション">
            {NAV.map(item => (
              <a key={item.href} href={item.href}
                onClick={handleNavClick}
                className="flex items-center justify-between py-3.5
                  border-b border-surface-line text-[15px] font-semibold text-navy">
                {item.label}
                <IconArrowRight className="text-ink-light" />
              </a>
            ))}
          </nav>

          {/* スマホメニュー内のCTA */}
          <div className="px-5 py-5 space-y-3 bg-surface-soft">
            <a href="#works" onClick={handleNavClick}
              className="flex items-center justify-center gap-2 w-full py-3.5
                border border-navy/25 text-navy font-bold text-sm rounded-sm">
              制作実績を見る
            </a>
            <a href={BOOKING.url} target="_blank" rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5
                bg-navy text-white font-bold text-sm rounded-sm">
              無料相談を予約する
            </a>
            <a href={CONTACT.mailto} onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3
                text-ink-mid font-semibold text-sm">
              <IconMail />
              メールで問い合わせる
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
