import { SERVICES } from '../data/site'
import { Section, SectionHead, Reveal } from './ui'

/** 支援内容：巨大な番号を主役にし、カードの反復を避ける */
export default function Service() {
  return (
    <Section id="service" tone="navy">
      <SectionHead
        num="03"
        en="Service"
        title="支援内容"
        lead="業務の整理から、ツールの設計・開発、導入後の改善までを一貫して担当します。"
        dark
      />

      <div className="border-t border-white/10">
        {SERVICES.map((service, i) => (
          <Reveal key={service.num}
            delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
            className="grid sm:grid-cols-[auto_1fr] lg:grid-cols-[8rem_18rem_1fr]
              gap-x-8 gap-y-3 items-baseline
              border-b border-white/10 py-8 lg:py-10">
            <span aria-hidden="true"
              className="font-en text-[2.4rem] lg:text-[3rem] leading-none
                text-white/12 select-none">
              {service.num}
            </span>

            <h3 className="font-mincho text-[1.15rem] lg:text-[1.35rem] text-white">
              {service.title}
            </h3>

            <p className="text-[14px] leading-[2] text-white/65 max-w-xl">
              {service.body}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
