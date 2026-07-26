import { WORKS } from '../data/works'
import { SITE } from '../data/site'
import {
  Section, SectionHead, Reveal, useReveal,
  BookingButton, OutlineButton, IconExternal, IconCheck,
} from './ui'
import { BrowserMock, PhoneMock } from './Mockup'

export default function Works() {
  return (
    <Section id="works" tone="soft">
      <SectionHead
        en="Works"
        title="制作実績"
        lead={`${SITE.name}が設計・開発したツールをご覧いただけます。`}
      />

      <div className="space-y-14">
        {WORKS.map(work => (
          <WorkItem key={work.title} work={work} />
        ))}
      </div>
    </Section>
  )
}

function WorkItem({ work }: { work: (typeof WORKS)[number] }) {
  const visual = useReveal<HTMLDivElement>()

  return (
    <article className="bg-white border border-surface-line rounded-lg
      overflow-hidden">

      {/* ── 上部：ツール画面 ── */}
      <div ref={visual.ref}
        className={`work-visual ${visual.visible ? 'is-visible' : ''}
          relative bg-surface-soft px-5 sm:px-10 pt-8 sm:pt-12 pb-10 sm:pb-12`}>
        <div className="max-w-3xl mx-auto relative">
          <BrowserMock src={work.images.pc} alt={`${work.title}のPC画面`} />
          <div className="absolute -bottom-5 -right-1 sm:right-2
            w-[24%] max-w-[120px]">
            <PhoneMock src={work.images.sp} alt={`${work.title}のスマートフォン画面`} />
          </div>
        </div>
      </div>

      {/* ── 下部：詳細 ── */}
      <div className="p-6 sm:p-10">
        <Reveal>
          <span className="inline-block text-[11px] font-bold tracking-wider
            text-accent bg-accent-light px-3 py-1 rounded-sm mb-4">
            {work.badge}
          </span>
          <h3 className="text-xl sm:text-2xl text-navy mb-3">{work.title}</h3>
          <p className="text-[14px] leading-[1.85] text-ink-mid mb-8">
            {work.summary}
          </p>
        </Reveal>

        {/* 課題 / 解決方法 */}
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          <Reveal delay={1} className="bg-surface-soft rounded-md p-5">
            <p className="text-[11px] font-bold tracking-[0.2em] text-ink-light
              uppercase mb-2.5">Problem</p>
            <p className="text-[14px] font-bold text-navy mb-2">課題</p>
            <p className="text-[13.5px] leading-[1.85] text-ink-mid">
              {work.problem}
            </p>
          </Reveal>

          <Reveal delay={2} className="bg-navy rounded-md p-5">
            <p className="text-[11px] font-bold tracking-[0.2em]
              text-accent-light/70 uppercase mb-2.5">Solution</p>
            <p className="text-[14px] font-bold text-white mb-2">解決方法</p>
            <p className="text-[13.5px] leading-[1.85] text-white/75">
              {work.solution}
            </p>
          </Reveal>
        </div>

        {/* 主な機能 / 担当範囲 */}
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mb-8
          pt-7 border-t border-surface-line">
          <Reveal delay={3}>
            <p className="text-[13px] font-bold text-navy mb-3">主な機能</p>
            <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 gap-2">
              {work.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-[13.5px] text-ink-mid">
                  <span className="text-accent mt-1 shrink-0"><IconCheck /></span>
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={4}>
            <p className="text-[13px] font-bold text-navy mb-3">担当範囲</p>
            <div className="flex flex-wrap gap-2">
              {work.scope.map(s => (
                <span key={s} className="text-[12.5px] text-ink-mid
                  border border-surface-line rounded-sm px-2.5 py-1">
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* CTA */}
        <Reveal delay={5} className="flex flex-col sm:flex-row gap-3
          pt-7 border-t border-surface-line">
          {work.demoUrl ? (
            <OutlineButton href={work.demoUrl} external
              className="w-full sm:w-auto">
              デモツールを開く
              <IconExternal />
            </OutlineButton>
          ) : (
            <span className="inline-flex items-center px-7 py-4 text-sm
              font-bold text-ink-light bg-surface-soft rounded-sm">
              準備中
            </span>
          )}
          <BookingButton label="無料相談を予約する" className="w-full sm:w-auto" />
        </Reveal>
      </div>
    </article>
  )
}
