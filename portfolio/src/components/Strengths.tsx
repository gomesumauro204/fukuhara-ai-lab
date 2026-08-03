import { STRENGTHS, SITE } from '../data/site'
import { Section, SectionHead, Reveal } from './ui'

/** 特徴：上に細いアクセント帯を引いたカード型。スマホでは1列で読みやすさを優先 */
export default function Strengths() {
  return (
    <Section
      id="strengths"
      tone="paper"
      accent="forest"
      background={
        <div className="values-photo-wrap" aria-hidden="true">
          <img
            src="/images/pegasus-values.jpg"
            alt=""
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="values-photo"
          />
          <div className="values-photo-overlay" />
        </div>
      }
    >
      <SectionHead
        num="03"
        en="Strengths"
        title={`${SITE.name}が大切にしていること`}
        lead="作ることを目的にせず、導入後に迷わず使える状態まで見据えて進めます。"
      />

      <div className="grid gap-6 sm:gap-x-8 sm:gap-y-8 lg:grid-cols-2">
        {STRENGTHS.map((item, i) => (
          <Reveal key={item.num}
            kind="body"
            dir={i % 2 === 0 ? 'left' : 'right'}
            delay={((i % 2) + 1) as 1 | 2}
            className="strength-card relative rounded-sm bg-white/55 px-6 sm:px-8 py-7 sm:py-8">
            {/* 上部のアクセント帯：カードが現れると同時に左から描画される
                （ホバー不要・スマホでも見える） */}
            <span aria-hidden="true" className="strength-bar absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: 'var(--accent, #C9A961)' }} />
            <p className="font-en text-[11px] mb-3"
              style={{ letterSpacing: '0.3em', color: 'var(--accent-ink, #7A5F26)' }}>
              {item.num}
            </p>
            <h3 className="font-mincho text-[1.2rem] text-ink mb-3">
              {item.title}
            </h3>
            <p className="text-[14px] leading-[2] text-ink-mid">
              {item.body}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
