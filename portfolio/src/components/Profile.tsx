import { PROFILE, SITE } from '../data/site'
import { Section, SectionHead, Reveal } from './ui'

export default function Profile() {
  return (
    <Section id="about" tone="soft">
      <SectionHead
        en="About"
        title={`${SITE.name}について`}
      />

      <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-8 lg:gap-14">

        {/* 左：氏名・担当 */}
        <Reveal>
          <div className="bg-white border border-surface-line rounded-md p-6 sm:p-8">
            <p className="text-[11px] font-bold tracking-[0.2em] text-accent
              uppercase mb-3">Profile</p>
            <p className="text-xl sm:text-2xl font-bold text-navy mb-5">
              {PROFILE.name}
            </p>
            <div className="pt-5 border-t border-surface-line">
              <p className="text-[12px] font-bold text-ink-light mb-2">担当</p>
              <p className="text-[13.5px] leading-[1.85] text-ink-mid">
                {PROFILE.role}
              </p>
            </div>
          </div>
        </Reveal>

        {/* 右：本文 */}
        <Reveal delay={1} className="flex flex-col gap-5 lg:pt-2">
          {PROFILE.body.map((paragraph, i) => (
            <p key={i} className="text-body-lg text-ink-mid">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </Section>
  )
}
