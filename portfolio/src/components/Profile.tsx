import { PROFILE, SITE } from '../data/site'
import { Section, SectionHead, Reveal } from './ui'

/**
 * プロフィール：業務にあたっている様子の写真をセクション背景の
 * 右側へ大きく配置する。本人写真として断定はせず、あくまで
 * 「業務にあたっている様子」の一場面として扱う。
 */
export default function Profile() {
  return (
    <Section
      id="about"
      tone="navy"
      accent="teal"
      background={
        <div className="prof-photo-wrap" aria-hidden="true">
          <picture>
            <source media="(max-width: 767px)" srcSet="/profile-work-sm.webp" />
            <img
              src="/profile-work.webp"
              alt=""
              width={1600}
              height={901}
              loading="lazy"
              decoding="async"
              className="prof-photo"
            />
          </picture>
          <div className="prof-photo-overlay" />
        </div>
      }
    >
      <SectionHead
        num="06"
        en="Profile"
        title={`${SITE.name}について`}
        dark
      />

      <div className="grid lg:grid-cols-[18rem_1fr] gap-10 lg:gap-16">

        {/* 名称・担当 */}
        <Reveal>
          <p className="font-mincho text-[1.8rem] text-white mb-1">
            {PROFILE.name}
          </p>
          <p className="text-[12.5px] text-gold-bright tracking-[0.1em]">
            {PROFILE.role}
          </p>
          <div className="w-10 h-px my-6" aria-hidden="true"
            style={{ background: 'var(--accent, #C9A961)' }} />
          <p className="text-[13px] leading-[1.95] text-white/65">
            {PROFILE.taskLine}
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
