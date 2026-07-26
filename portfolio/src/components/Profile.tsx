import { PROFILE, SITE } from '../data/site'
import { Section, SectionHead, Reveal } from './ui'

export default function Profile() {
  return (
    <Section id="about" tone="navy">
      <SectionHead
        num="07"
        en="Profile"
        title={`${SITE.name}について`}
        dark
      />

      <div className="grid lg:grid-cols-[18rem_1fr] gap-10 lg:gap-16">

        {/* 氏名・担当 */}
        <Reveal>
          <p className="font-mincho text-[1.8rem] text-white mb-2">
            {PROFILE.name}
          </p>
          <div className="w-10 h-px bg-gold my-6" aria-hidden="true" />
          <p className="label-en mb-3">Role</p>
          <p className="text-[13px] leading-[1.95] text-white/65">
            {PROFILE.role}
          </p>
        </Reveal>

        {/* 本文 */}
        <Reveal delay={1} className="flex flex-col gap-6 max-w-2xl">
          {PROFILE.body.map((paragraph, i) => (
            <p key={i} className="text-[14.5px] leading-[2.1] text-white/70">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </Section>
  )
}
