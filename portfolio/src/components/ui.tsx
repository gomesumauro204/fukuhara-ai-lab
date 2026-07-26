import { useEffect, useRef, useState, type ReactNode } from 'react'
import { BOOKING } from '../data/site'

// =============================================================
// スクロール連動アニメーション用フック
// 対象要素が画面に入ったら is-visible クラスを付与する
// =============================================================
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // 動きを減らす設定なら即座に表示
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

/** reveal クラスを自動で付ける薄いラッパー */
export function Reveal({
  children, delay, className = '', as: Tag = 'div',
}: {
  children: ReactNode
  /** 1〜6 の段差（stagger） */
  delay?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  as?: 'div' | 'li' | 'section' | 'article'
}) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  const delayClass = delay ? `reveal-${delay}` : ''

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${delayClass} ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}

// =============================================================
// アイコン（絵文字は使わずSVGで統一）
// =============================================================
export function IconArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      aria-hidden="true" className={className}>
      <path d="M2.5 8h11M9.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconExternal() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M6 2H2.5a1 1 0 00-1 1v8.5a1 1 0 001 1H11a1 1 0 001-1V8M8.5 1.5h4m0 0v4m0-4L6 8"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3.5" width="12" height="10.5" rx="1.5"
        stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 6.5h12M5.5 1.75v2.5M10.5 1.75v2.5" stroke="currentColor"
        strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5"
        stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.25 4.25L8 8.75l5.75-4.5" stroke="currentColor"
        strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconChevron({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"
      className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
      <path d="M4.5 7l4.5 4.5L13.5 7" stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// =============================================================
// セクション枠
// =============================================================
export function Section({
  id, children, tone = 'light', className = '',
}: {
  id?: string
  children: ReactNode
  tone?: 'light' | 'soft' | 'dark'
  className?: string
}) {
  const toneClass =
    tone === 'dark' ? 'bg-navy text-white'
    : tone === 'soft' ? 'bg-surface-soft'
    : 'bg-surface'

  return (
    <section id={id}
      className={`py-section lg:py-section-lg ${toneClass} ${className}`}>
      <div className="max-w-content mx-auto px-5 sm:px-8 lg:px-12">
        {children}
      </div>
    </section>
  )
}

/** 英字ラベル + 日本語見出し */
export function SectionHead({
  en, title, lead, dark = false, center = false,
}: {
  en: string
  title: string
  lead?: string
  dark?: boolean
  center?: boolean
}) {
  return (
    <Reveal className={`mb-10 sm:mb-14 ${center ? 'text-center' : ''}`}>
      <p className={`text-[11px] font-bold tracking-[0.3em] uppercase mb-3
        ${dark ? 'text-accent-light/70' : 'text-accent'}`}>
        {en}
      </p>
      <h2 className={`text-[1.6rem] sm:text-3xl lg:text-[2.1rem]
        ${dark ? 'text-white' : 'text-navy'}`}>
        {title}
      </h2>
      {lead && (
        <p className={`mt-4 text-body-lg max-w-2xl ${center ? 'mx-auto' : ''}
          ${dark ? 'text-white/70' : 'text-ink-mid'}`}>
          {lead}
        </p>
      )}
    </Reveal>
  )
}

// =============================================================
// ボタン
// =============================================================
const btnBase =
  'inline-flex items-center justify-center gap-2.5 font-bold text-sm ' +
  'px-7 py-4 transition-colors duration-200 rounded-sm'

/** 無料相談（TimeRex）— サイト内のすべての予約導線はこれを使う */
export function BookingButton({
  variant = 'primary', label, className = '',
}: {
  variant?: 'primary' | 'onDark' | 'compact'
  label?: string
  className?: string
}) {
  const styles =
    variant === 'onDark'
      ? 'bg-white text-navy hover:bg-accent-light'
      : variant === 'compact'
      ? 'bg-navy text-white hover:bg-navy-light !px-5 !py-2.5 !text-[13px]'
      : 'bg-navy text-white hover:bg-navy-light'

  return (
    <a
      href={BOOKING.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${btnBase} ${styles} ${className}`}
    >
      <IconCalendar />
      {label ?? BOOKING.label}
    </a>
  )
}

/** ページ内リンク / 外部リンク共用の枠線ボタン */
export function OutlineButton({
  href, children, external = false, onDark = false, className = '',
}: {
  href: string
  children: ReactNode
  external?: boolean
  onDark?: boolean
  className?: string
}) {
  const styles = onDark
    ? 'border border-white/40 text-white hover:bg-white/10 hover:border-white/70'
    : 'border border-navy/25 text-navy hover:border-navy hover:bg-navy/[0.04]'

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${btnBase} ${styles} ${className}`}
    >
      {children}
    </a>
  )
}
