import { WORKS, type Work } from '../data/works'
import {
  Section, SectionHead, Reveal,
  BookingButton, LinkButton, IconExternal,
} from './ui'
import { DesktopScreen, PhoneScreen, useImageExists } from './ScreenFrame'

/**
 * 制作実績
 *
 * このサイトで最も重要なセクション。スクリーンショット・ツール名・
 * 対象業務・解決する課題・主な機能・デモ導線を一目で伝える。
 *
 * 画像の有無でカードの構成そのものを切り替える。
 * ・画像あり → 2カラムで画像を大きく見せる（左右交互）
 * ・画像なし → 単カラムの「説明中心カード」。空の大枠は作らない
 *
 * スマートフォンでは常に完全な縦並びにし、絶対配置要素が
 * 本文・ボタンへ重ならないよう十分な余白を確保している。
 */
export default function Works() {
  return (
    <Section id="works" tone="navy">
      <SectionHead
        num="01"
        en="Works"
        title="制作実績"
        lead="実際の業務を題材に、記録・共有・管理を効率化するWebツールを設計・開発しています。公開中のものはデモから操作いただけます。"
        dark
      />

      <div className="space-y-16 lg:space-y-24">
        {WORKS.map((work, i) => (
          <WorkItem key={work.title} work={work} index={i} />
        ))}
      </div>
    </Section>
  )
}

function WorkItem({ work, index }: { work: Work; index: number }) {
  const hasImage = useImageExists(work.images.pc) === true

  return hasImage
    ? <WorkItemWithImage work={work} index={index} />
    : <WorkItemCompact work={work} index={index} />
}

// =================================================================
// 画像あり：2カラムで画像を大きく見せる（左右交互）
// =================================================================
function WorkItemWithImage({ work, index }: { work: Work; index: number }) {
  const imageOnRight = index % 2 === 1
  const contentDir = imageOnRight ? 'left' : 'right'
  const imageDir = imageOnRight ? 'right' : 'left'

  return (
    <article className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

      {/*
        ツール画面。外側（parallax）と内側（フェードイン）で transform の
        役割を分け、スクロール追従とスケールイン演出が競合しないように
        している。下端に余白を確保し、スマホ用の重ねたスマホ枠が
        本文へ重ならないようにする。
      */}
      <div data-parallax
        className={`img-parallax pb-10 sm:pb-12 ${imageOnRight ? 'lg:order-2' : 'lg:order-1'}`}>
        <Reveal kind="image" dir={imageDir} className="relative">
          <div className="relative w-full max-w-sm mx-auto lg:mx-0">
            <DesktopScreen
              src={work.images.pc}
              alt={`${work.title}のPC画面`}
            />

            {/* スマホ画面を重ねる（オーバーラップを浅くして本文への被りを防ぐ） */}
            <div className={`absolute -bottom-6 w-[20%] max-w-[96px]
              ${imageOnRight ? 'left-2 sm:-left-6' : 'right-2 sm:-right-6'}`}>
              <PhoneScreen
                src={work.images.sp}
                alt={`${work.title}のスマートフォン画面`}
              />
            </div>
          </div>
        </Reveal>
      </div>

      <div className={`min-w-0 ${imageOnRight ? 'lg:order-1' : 'lg:order-2'}`}>
        <WorkContent work={work} index={index} dir={contentDir} />
      </div>
    </article>
  )
}

// =================================================================
// 画像なし：単カラムの「説明中心カード」。大きな空枠は作らない
// =================================================================
function WorkItemCompact({ work, index }: { work: Work; index: number }) {
  return (
    <article className="w-full max-w-2xl mx-auto lg:mx-0
      border border-white/12 rounded-md px-5 py-8 sm:px-9 sm:py-10">
      <WorkContent work={work} index={index} dir="up" compact />
    </article>
  )
}

// =================================================================
// 共通の本文（バッジ・タイトル・課題・機能・CTA）
// 数字→ラベル→見出し→本文→機能→罫線→CTA の順に時間差で現れる
// =================================================================
function WorkContent({
  work, index, dir, compact = false,
}: { work: Work; index: number; dir: 'up' | 'left' | 'right'; compact?: boolean }) {
  return (
    <>
      {/* 番号 + バッジ + 対象業務 */}
      <Reveal kind="label" dir={dir} delay={1}
        className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
        <span className="font-en text-[13px] text-gold-bright">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-[11px] font-semibold tracking-wider
          text-gold border border-gold/45 rounded-full px-3.5 py-1">
          {work.badge}
        </span>
        <span className="label-en">{work.target}</span>
      </Reveal>

      {/* ツール名 */}
      <Reveal kind="heading" dir={dir} delay={2}>
        <h3 className="font-mincho text-[1.4rem] sm:text-[1.7rem] text-white mb-4
          leading-[1.4] break-words">
          {work.title}
        </h3>
      </Reveal>

      {/* 画像未登録時のみ：小さく控えめな案内（大きな空枠にはしない） */}
      {compact && (
        <Reveal kind="label" dir={dir} delay={2}
          className="flex items-center gap-2 mb-6">
          <span className="grid place-items-center w-6 h-6 rounded-[3px]
            border border-gold/35 text-gold font-en text-[10px] shrink-0">
            F
          </span>
          <span className="text-[11px] text-white/55">
            スクリーンショットは準備中です
          </span>
        </Reveal>
      )}

      {/* 解決する課題 */}
      <Reveal kind="body" dir={dir} delay={3} className="mb-8">
        <p className="label-en mb-2.5">Problem</p>
        <p className="text-[14px] leading-[1.95] text-white/65 max-w-lg">
          {work.problem}
        </p>
      </Reveal>

      {/* 主な機能 */}
      <Reveal kind="body" dir={dir} delay={4} className="mb-9">
        <p className="label-en mb-3.5">Key Features</p>
        <ul className={`grid gap-x-6 gap-y-2.5 ${compact ? 'sm:grid-cols-2' : 'grid-cols-2'}`}>
          {work.features.map(feature => (
            <li key={feature.name}
              className="flex items-start gap-2 text-[13px] text-white/75 min-w-0">
              <span className="w-1 h-1 rounded-full bg-gold/70 mt-2 shrink-0"
                aria-hidden="true" />
              <span className="break-words">{feature.name}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* 罫線：横方向に伸びて次のブロックと区切る */}
      <Reveal kind="body" dir={dir} delay={5}
        className="h-px bg-white/10 mb-7 origin-left">
        <span />
      </Reveal>

      {/* 導線：最後に控えめに現れる */}
      <Reveal kind="cta" dir={dir} delay={6}
        className="flex flex-col sm:flex-row gap-3">
        {work.demoUrl ? (
          <LinkButton href={work.demoUrl} external tone="solidGold"
            className="w-full sm:w-auto">
            デモを見る
            <IconExternal />
          </LinkButton>
        ) : (
          <span className="inline-flex items-center justify-center rounded-full
            px-7 py-4 text-[13.5px] font-semibold text-white/30
            border border-white/10">
            準備中
          </span>
        )}
        <BookingButton tone="outline" label="このようなツールを相談する"
          className="w-full sm:w-auto" />
      </Reveal>
    </>
  )
}
