import { useEffect, useRef, useState, type ReactNode } from 'react'
import { BOOKING } from '../data/site'

// =============================================================
// スクロール連動アニメーション
// 画面に入ったら is-in を付与する。一度表示したら監視を解除。
// =============================================================
export function useInView<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // 動きを減らす設定なら即時表示
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, inView }
}

type Stagger = 1 | 2 | 3 | 4

/** 画面に入ったら軽くフェードアップする薄いラッパー */
export function Reveal({
  children, delay, className = '', as: Tag = 'div',
}: {
  children: ReactNode
  delay?: Stagger
  className?: string
  as?: 'div' | 'li' | 'article'
}) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${delay ? `reveal-${delay}` : ''} ${inView ? 'is-in' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}

// =============================================================
// アイコン（絵文字は使わずSVGで統一）
// =============================================================
export function IconArrow({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none"
      aria-hidden="true" className={className}>
      <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconExternal() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path d="M5.5 2H2v9h9V7.5M8 1.5h3.5V5M11 2L5.5 7.5"
        stroke="currentColor" strokeWidth="1.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.75" y="3.5" width="12.5" height="9" rx="1"
        stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.25 4.25L8 8.5l5.75-4.25" stroke="currentColor"
        strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconChevron({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
      className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
      <path d="M3.5 6L8 10.5L12.5 6" stroke="currentColor" strokeWidth="1.3"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** コーナーアンカーの星印 */
export function MarkStar({ className = '' }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
      aria-hidden="true" className={className}>
      <path d="M6 0v12M0 6h12M1.8 1.8l8.4 8.4M10.2 1.8l-8.4 8.4"
        stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
}

// =============================================================
// セクション
// =============================================================
type Tone = 'navy' | 'deep' | 'paper'

const TONE_CLASS: Record<Tone, string> = {
  navy:  'bg-navy text-white',
  deep:  'bg-navy-deep text-white',
  paper: 'bg-paper text-ink',
}

export function Section({
  id, children, tone = 'navy', className = '',
}: {
  id?: string
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <section id={id} className={`${TONE_CLASS[tone]} ${className}`}>
      <div className="max-w-content mx-auto px-5 sm:px-8 lg:px-12
        py-section lg:py-section-lg">
        {children}
      </div>
    </section>
  )
}

/** 通し番号 + 英字ラベル + 日本語見出し */
export function SectionHead({
  num, en, title, lead, dark = false, className = '',
}: {
  num: string
  en: string
  title: string
  lead?: string
  dark?: boolean
  className?: string
}) {
  return (
    <Reveal className={`mb-12 lg:mb-16 ${className}`}>
      <div className="flex items-start gap-5 sm:gap-8">
        {/* 通し番号は装飾。内容は英字ラベルと日本語見出しで伝える */}
        <span aria-hidden="true"
          className={`section-num ${dark ? 'text-white/10' : 'text-ink/10'}`}>
          {num}
        </span>
        <div className="pt-2 sm:pt-4 min-w-0">
          <p className={dark ? 'label-en' : 'label-en-dark'}>{en}</p>
          <h2 className={`font-mincho mt-2
            text-[1.7rem] sm:text-[2.1rem] lg:text-[2.5rem]
            ${dark ? 'text-white' : 'text-ink'}`}>
            {title}
          </h2>
        </div>
      </div>

      {lead && (
        <p className={`mt-6 max-w-2xl text-[15px] leading-[1.95]
          ${dark ? 'text-white/60' : 'text-ink-mid'}`}>
          {lead}
        </p>
      )}
    </Reveal>
  )
}

// =============================================================
// ボタン
// 細枠 + 矢印。ホバーで矢印が伸びる。
// =============================================================
const BTN_BASE =
  'group inline-flex items-center justify-between gap-6 rounded-full ' +
  'px-7 py-4 text-[13.5px] font-semibold whitespace-nowrap ' +
  'transition-colors duration-200'

const BTN_TONE = {
  gold:      'border border-gold/55 text-gold hover:border-gold hover:bg-gold/[0.07]',
  outline:   'border border-white/25 text-white hover:border-white/60 hover:bg-white/[0.05]',
  onPaper:   'border border-ink/25 text-ink hover:border-ink/60 hover:bg-ink/[0.04]',
  solidGold: 'border border-gold bg-gold text-navy-deep hover:bg-gold-bright hover:border-gold-bright',
} as const

type BtnTone = keyof typeof BTN_TONE

function ButtonInner({ children }: { children: ReactNode }) {
  return (
    <>
      <span>{children}</span>
      <IconArrow className="shrink-0 transition-transform duration-300
        group-hover:translate-x-1" />
    </>
  )
}

/** 無料相談（TimeRex）— サイト内のすべての予約導線はこれを使う */
export function BookingButton({
  tone = 'gold', label, className = '',
}: {
  tone?: BtnTone
  label?: string
  className?: string
}) {
  return (
    <a
      href={BOOKING.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${BTN_BASE} ${BTN_TONE[tone]} ${className}`}
    >
      <ButtonInner>{label ?? BOOKING.label}</ButtonInner>
    </a>
  )
}

/** ページ内リンク / 外部リンク共用 */
export function LinkButton({
  href, children, tone = 'outline', external = false, className = '',
}: {
  href: string
  children: ReactNode
  tone?: BtnTone
  external?: boolean
  className?: string
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${BTN_BASE} ${BTN_TONE[tone]} ${className}`}
    >
      <ButtonInner>{children}</ButtonInner>
    </a>
  )
}
