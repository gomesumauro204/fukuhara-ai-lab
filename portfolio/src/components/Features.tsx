import { FEATURES_LIST, SITE } from '../data/site'
import { Section, SectionHead, Reveal } from './ui'

export default function Features() {
  return (
    <Section id="features">
      <SectionHead
        en="Features"
        title={`${SITE.name}の特徴`}
        lead="作ることを目的にせず、実際に使われる状態まで見据えて進めます。"
      />

      {/* スマホは1列で読みやすさを優先 */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        {FEATURES_LIST.map((feature, i) => (
          <Reveal key={feature.title} delay={((i % 2) + 1) as 1 | 2}
            className="flex items-start gap-4 sm:gap-5
              border-l-2 border-accent pl-5 sm:pl-6 py-1">
            <div className="min-w-0">
              <h3 className="text-[16px] sm:text-[17px] text-navy mb-2">
                {feature.title}
              </h3>
              <p className="text-[14px] leading-[1.85] text-ink-mid">
                {feature.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
