import { STRENGTHS, SITE } from '../data/site'
import { Section, SectionHead, Reveal } from './ui'

/** 特徴：左に縦線を引いた読み物型。スマホでは1列で読みやすさを優先 */
export default function Strengths() {
  return (
    <Section id="strengths" tone="paper">
      <SectionHead
        num="04"
        en="Strengths"
        title={`${SITE.name}が大切にしていること`}
        lead="作ることを目的にせず、導入後に迷わず使える状態まで見据えて進めます。"
      />

      <div className="grid gap-10 sm:gap-x-14 sm:gap-y-12 lg:grid-cols-2">
        {STRENGTHS.map((item, i) => (
          <Reveal key={item.num}
            kind="body"
            delay={((i % 2) + 1) as 1 | 2}
            className="border-l border-gold/50 pl-6 sm:pl-8">
            <p className="font-en text-[11px] text-gold-deep mb-3"
              style={{ letterSpacing: '0.3em' }}>
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
