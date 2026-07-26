import { TEAM } from '../data/site'
import { Section, SectionHead, Reveal } from './ui'

/**
 * 案件に合わせた専門体制
 *
 * 会社規模を大きく見せる意図はない。
 * 「福原が窓口となり、案件ごとに必要な専門性を編成する」ことを
 * 構図と注記の両方で正確に伝える。
 */
export default function Team() {
  return (
    <Section id="team" tone="paper">
      <SectionHead
        num="06"
        en="Project Team"
        title="案件に合わせた専門体制"
      />

      <Reveal className="mb-14 max-w-3xl">
        <p className="font-mincho text-[1.35rem] sm:text-[1.7rem] text-ink mb-6
          leading-[1.55]">
          {TEAM.headline}
        </p>
        <p className="text-[14.5px] leading-[2] text-ink-mid">
          {TEAM.body}
        </p>
      </Reveal>

      <div className="grid lg:grid-cols-[20rem_1fr] gap-10 lg:gap-16 items-start">

        {/* ── 窓口（常に福原が担当） ── */}
        <Reveal className="border border-gold/50 bg-white/60 p-7 rounded-sm">
          <p className="label-en-dark mb-4" style={{ color: '#7A5F26' }}>
            Contact Window
          </p>
          <p className="font-mincho text-[1.5rem] text-ink mb-1">
            {TEAM.core.name}
          </p>
          <p className="text-[12px] text-ink-soft mb-6">{TEAM.core.role}</p>

          <ul className="flex flex-col gap-2.5 pt-5 border-t border-ink/12">
            {TEAM.core.tasks.map(task => (
              <li key={task} className="flex items-center gap-3
                text-[13.5px] text-ink-mid">
                <span className="w-3 h-px bg-gold" aria-hidden="true" />
                {task}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ── 案件に応じて連携する専門分野 ── */}
        <div>
          <p className="label-en-dark mb-6">Connected Specialists</p>

          <ul className="border-t border-ink/12">
            {TEAM.partners.map((partner, i) => (
              <Reveal key={partner.field} as="li"
                delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
                className="flex items-baseline gap-5 sm:gap-8
                  border-b border-ink/12 py-5">
                {/* 接続を示す短い横線 */}
                <span aria-hidden="true"
                  className="w-6 sm:w-10 h-px bg-ink/25 shrink-0
                    translate-y-[-3px]" />
                <span className="min-w-0 flex-1 flex flex-wrap
                  items-baseline gap-x-4 gap-y-1">
                  <span className="text-[15px] font-semibold text-ink">
                    {partner.field}
                  </span>
                  <span className="text-[12.5px] text-ink-soft">
                    {partner.note}
                  </span>
                </span>
              </Reveal>
            ))}
          </ul>

          {/* 誤解を避けるための注記 */}
          <Reveal className="mt-7 flex items-start gap-3">
            <span aria-hidden="true"
              className="w-1 self-stretch bg-ink/15 shrink-0" />
            <p className="text-[12.5px] leading-[1.9] text-ink-soft">
              {TEAM.disclaimer}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
