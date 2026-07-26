import { WORKS, type Work } from '../data/works'
import {
  Section, SectionHead, Reveal, useInView,
  BookingButton, LinkButton, IconExternal,
} from './ui'
import { DesktopScreen, PhoneScreen } from './ScreenFrame'

/**
 * 制作実績
 *
 * このサイトで最も重要なセクション。
 * 「何が課題で、どう解決し、何ができるのか」が一目で伝わるよう、
 * 画面 → 課題/解決 → 機能 → 担当範囲 → 導線 の順に構成する。
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

      <div className="space-y-24">
        {WORKS.map(work => <WorkItem key={work.title} work={work} />)}
      </div>
    </Section>
  )
}

function WorkItem({ work }: { work: Work }) {
  const visual = useInView<HTMLDivElement>()

  return (
    <article>
      {/* ── ツール画面 ── */}
      <div
        ref={visual.ref}
        className={`reveal ${visual.inView ? 'is-in' : ''}
          relative mb-12 lg:mb-16`}
      >
        <div className="relative max-w-4xl mx-auto lg:mx-0 lg:ml-auto lg:mr-[6%]">
          <DesktopScreen
            src={work.images.pc}
            alt={`${work.title}のPC画面`}
          />

          {/* スマホ画面を左下に重ねる */}
          <div className="absolute -bottom-8 -left-3 sm:-left-8 lg:-left-16
            w-[22%] max-w-[122px]">
            <PhoneScreen
              src={work.images.sp}
              alt={`${work.title}のスマートフォン画面`}
            />
          </div>
        </div>
      </div>

      {/* ── 概要 ── */}
      <Reveal className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="text-[11px] font-semibold tracking-wider
            text-gold border border-gold/45 rounded-full px-3.5 py-1">
            {work.badge}
          </span>
          <span className="label-en">Case 01</span>
        </div>

        <h3 className="font-mincho text-[1.5rem] sm:text-[2rem] text-white mb-4">
          {work.title}
        </h3>
        <p className="text-[14.5px] leading-[1.95] text-white/60 max-w-2xl">
          {work.summary}
        </p>
      </Reveal>

      {/* ── 課題 / 解決方法 ── */}
      <div className="grid lg:grid-cols-2 gap-px bg-white/10 mb-14">
        <Reveal className="bg-navy p-7 sm:p-9">
          <p className="label-en mb-4">Problem</p>
          <h4 className="font-mincho text-[1.15rem] text-white/90 mb-4">
            課題
          </h4>
          <p className="text-[14px] leading-[2] text-white/60">
            {work.problem}
          </p>
        </Reveal>

        <Reveal delay={1} className="bg-navy-lift p-7 sm:p-9 relative">
          <span aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r
              from-gold/60 to-transparent lg:hidden" />
          <span aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px bg-gradient-to-b
              from-gold/60 to-transparent hidden lg:block" />
          <p className="label-en mb-4" style={{ color: '#D9BE83' }}>
            Solution
          </p>
          <h4 className="font-mincho text-[1.15rem] text-white mb-4">
            解決方法
          </h4>
          <p className="text-[14px] leading-[2] text-white/70">
            {work.solution}
          </p>
        </Reveal>
      </div>

      {/* ── 主な機能 ── */}
      <Reveal className="mb-14">
        <div className="flex items-baseline gap-4 mb-7">
          <h4 className="font-mincho text-[1.15rem] text-white">主な機能</h4>
          <span className="flex-1 h-px bg-white/10" aria-hidden="true" />
          <span className="label-en">{work.features.length} Features</span>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {work.features.map((feature, i) => (
            <li key={feature.name} className="flex gap-4 items-start">
              <span className="font-en text-[11px] text-gold-bright leading-[1.9] shrink-0 pt-px">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold text-white mb-1">
                  {feature.name}
                </span>
                <span className="block text-[12.5px] leading-[1.8] text-white/60">
                  {feature.note}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* ── 担当範囲 / 使用技術 ── */}
      <Reveal className="grid sm:grid-cols-2 gap-8 mb-12
        pt-10 border-t border-white/10">
        <div>
          <p className="label-en mb-4">Scope</p>
          <div className="flex flex-wrap gap-2">
            {work.scope.map(item => (
              <span key={item}
                className="text-[12px] text-white/70 border border-white/15
                  rounded-full px-3 py-1">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="label-en mb-4">Stack</p>
          <div className="flex flex-wrap gap-2">
            {work.stack.map(item => (
              <span key={item}
                className="font-en text-[12px] text-white/60 border border-white/10
                  rounded-full px-3 py-1">
                {item}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── 導線 ── */}
      <Reveal className="flex flex-col sm:flex-row gap-3">
        {work.demoUrl ? (
          <LinkButton href={work.demoUrl} external tone="solidGold"
            className="w-full sm:w-auto">
            デモツールを開く
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
    </article>
  )
}
