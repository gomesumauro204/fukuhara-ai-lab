import { useEffect, useRef, useState, type ReactNode } from 'react'
import { BOOKING } from '../data/site'
import SectionAmbience from './SectionAmbience'

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

export type Stagger = 1 | 2 | 3 | 4 | 5 | 6
type RevealDir = 'up' | 'left' | 'right'
/**
 * 役割ごとに移動量・時間を変える動きの種類。
 *   num     … 数字（薄く拡大しながら）
 *   label   … 英字ラベル（短い横移動）
 *   heading … 大見出し（下から24〜48px、やや長め）
 *   body    … 本文（見出しより控えめに16〜28px）
 *   image   … 画像／カード（40〜80px＋スケールイン）
 *   cta     … ボタン（最後に控えめに）
 *   block   … 既定（本文相当。数値の delay で段差だけ付けたい場合）
 */
type RevealKind = 'block' | 'num' | 'label' | 'heading' | 'body' | 'image' | 'cta'

/**
 * 画面に入ったら現れる薄いラッパー。役割ごとに異なる動きを持たせられる。
 *
 * kind:  上記参照。同じフェードアップの反復にならないよう、要素の役割に
 *        合わせて指定する。
 * delay: 1〜6 の段差（各0.12〜0.25s刻み）。数字→ラベル→見出し→本文→画像→CTA
 *        のように意味の単位ごとに1つずつ上げて時間差をつける。
 * dir:   'up'（既定・下から）/ 'left'（右から）/ 'right'（左から）
 *        制作実績など左右交互のレイアウトで使う。kind="image" と組み合わせると
 *        スケールイン＋斜め移動になる。
 *
 * 実装メモ：初期状態はすべて `:not(.is-in)` を使って定義しているため、
 * kind と dir を組み合わせても is-in 到達後に確実に transform:none へ戻る
 * （詳細度の衝突で残留する事故を構造的に防いでいる）。
 */
export function Reveal({
  children, delay, dir = 'up', kind = 'block', className = '', as: Tag = 'div', ...rest
}: {
  children: ReactNode
  delay?: Stagger
  dir?: RevealDir
  kind?: RevealKind
  className?: string
  as?: 'div' | 'li' | 'article'
  /** data-* など、追加でDOMへ渡したい属性 */
  [key: string]: unknown
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const dirClass = dir === 'up' ? '' : `reveal-${dir}`
  const kindClass = kind === 'block' ? '' : `reveal-${kind}`

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${kindClass} ${dirClass} ${delay ? `reveal-${delay}` : ''} ${inView ? 'is-in' : ''} ${className}`}
      {...rest}
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

// id から 0〜9 の擬似ランダムな種を作る（呼び出し側に seed を渡させない）
function seedFromId(id?: string) {
  if (!id) return 0
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 10
  return h
}

export function Section({
  id, children, tone = 'navy', className = '', ambience = true, bare = false,
}: {
  id?: string
  children: ReactNode
  tone?: Tone
  className?: string
  /** 背景の光・データラインを表示するか（既定 true） */
  ambience?: boolean
  /**
   * true の場合、通常の余白付きラッパーを省略し children をそのまま描画する。
   * スクロールシーン（ピン留めして内部で独自にレイアウトを組む場合）に使う。
   */
  bare?: boolean
}) {
  return (
    <section id={id}
      className={`relative overflow-hidden ${TONE_CLASS[tone]} ${className}`}>
      {ambience && <SectionAmbience tone={tone} seed={seedFromId(id)} />}
      {bare ? children : (
        <div className="relative z-10 max-w-content mx-auto px-5 sm:px-8 lg:px-12
          py-section lg:py-section-lg">
          {children}
        </div>
      )}
    </section>
  )
}

/**
 * 通し番号 + 英字ラベル + 日本語見出し + 説明文
 *
 * 数字（拡大しながら）→ 英字ラベル（横移動）→ 大見出し（下から）→
 * 説明文（見出しより控えめに）の順に時間差表示する。4つとも独立した
 * Reveal にして、それぞれ違う動き方をするようにしている。
 */
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
    <div className={`mb-12 lg:mb-16 ${className}`}>
      <div className="flex items-start gap-5 sm:gap-8">
        {/* 通し番号は装飾。内容は英字ラベルと日本語見出しで伝える */}
        <Reveal kind="num" delay={1} as="div"
          className={`section-num ${dark ? 'text-white/10' : 'text-ink/10'}`}>
          <span aria-hidden="true">{num}</span>
        </Reveal>
        <div className="pt-2 sm:pt-4 min-w-0">
          <Reveal kind="label" delay={2}>
            <p className={dark ? 'label-en' : 'label-en-dark'}>{en}</p>
          </Reveal>
          <Reveal kind="heading" delay={3}>
            <h2 className={`font-mincho mt-2
              text-[1.7rem] sm:text-[2.1rem] lg:text-[2.5rem]
              ${dark ? 'text-white' : 'text-ink'}`}>
              {title}
            </h2>
          </Reveal>
        </div>
      </div>

      {lead && (
        <Reveal kind="body" delay={4} className={`mt-6 max-w-2xl text-[15px] leading-[1.95]
          ${dark ? 'text-white/60' : 'text-ink-mid'}`}>
          <p>{lead}</p>
        </Reveal>
      )}
    </div>
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
