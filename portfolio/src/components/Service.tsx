import { SERVICES } from '../data/site'
import { Section, SectionHead, Reveal } from './ui'

export default function Service() {
  return (
    <Section id="service">
      <SectionHead
        en="Service"
        title="支援内容"
        lead="業務の整理から、ツールの設計・開発、導入後の改善までを一貫して支援します。"
      />

      <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
        {SERVICES.map((service, i) => (
          <Reveal key={service.num} delay={((i % 2) + 1) as 1 | 2}
            className="border border-surface-line rounded-md p-6 sm:p-8
              bg-white hover:border-navy/25 transition-colors">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-[13px] font-bold tracking-widest text-accent">
                {service.num}
              </span>
              <h3 className="text-[17px] sm:text-lg text-navy">
                {service.title}
              </h3>
            </div>
            <p className="text-[14px] leading-[1.85] text-ink-mid">
              {service.body}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
