import { WORKS, type Work } from '../data/works'
import {
  Section, SectionHead, Reveal,
  BookingButton, LinkButton, IconExternal,
} from './ui'
import { DesktopScreen, PhoneScreen } from './ScreenFrame'

/**
 * 制作実績
 *
 * このサイトで最も重要なセクション。スクリーンショット・ツール名・
 * 対象業務・解決する課題・主な機能・デモ導線を一目で伝える。
 * スクロール時は左右交互にフェードインし、単調な縦積みにしない。
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

      <div className="space-y-20 lg:space-y-28">
        {WORKS.map((work, i) => (
          <WorkItem key={work.title} work={work} index={i} />
        ))}
      </div>
    </Section>
  )
}

function WorkItem({ work, index }: { work: Work; index: number }) {
  // 偶数番目は画像が左、奇数番目は画像が右。中身は逆側からフェードインさせる。
  const imageOnRight = index % 2 === 1
  const contentDir = imageOnRight ? 'left' : 'right'
  const imageDir = imageOnRight ? 'right' : 'left'

  return (
    <article className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

      {/*
        ツール画面。外側（parallax）と内側（フェードイン）で transform の
        役割を分け、スクロール追従とフェードインが競合しないようにしている。
      */}
      <div data-parallax
        className={`img-parallax ${imageOnRight ? 'lg:order-2' : 'lg:order-1'}`}>
        <Reveal dir={imageDir} className="relative">
          <div className="relative max-w-md mx-auto lg:mx-0">
            <DesktopScreen
              src={work.images.pc}
              alt={`${work.title}のPC画面`}
            />

            {/* スマホ画面を重ねる */}
            <div className={`absolute -bottom-7 w-[24%] max-w-[110px]
              ${imageOnRight ? '-left-4 sm:-left-8' : '-right-4 sm:-right-8'}`}>
              <PhoneScreen
                src={work.images.sp}
                alt={`${work.title}のスマートフォン画面`}
              />
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── 内容 ── */}
      <div className={imageOnRight ? 'lg:order-1' : 'lg:order-2'}>
        {/* 番号 + バッジ + 対象業務 */}
        <Reveal dir={contentDir} delay={1}
          className="flex flex-wrap items-center gap-3 mb-5">
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
        <Reveal dir={contentDir} delay={2}>
          <h3 className="font-mincho text-[1.5rem] sm:text-[1.85rem] text-white mb-4">
            {work.title}
          </h3>
        </Reveal>

        {/* 解決する課題 */}
        <Reveal dir={contentDir} delay={3} className="mb-8">
          <p className="label-en mb-2.5">Problem</p>
          <p className="text-[14px] leading-[1.95] text-white/65 max-w-lg">
            {work.problem}
          </p>
        </Reveal>

        {/* 主な機能 */}
        <Reveal dir={contentDir} delay={4} className="mb-9">
          <p className="label-en mb-3.5">Key Features</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {work.features.map(feature => (
              <li key={feature.name}
                className="flex items-start gap-2 text-[13px] text-white/75">
                <span className="w-1 h-1 rounded-full bg-gold/70 mt-2 shrink-0"
                  aria-hidden="true" />
                {feature.name}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* 導線 */}
        <Reveal dir={contentDir} delay={5}
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
      </div>
    </article>
  )
}
