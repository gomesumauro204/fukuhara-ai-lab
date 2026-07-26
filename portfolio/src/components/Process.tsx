import { PROCESS } from '../data/site'
import { Section, SectionHead, Reveal, useReveal } from './ui'

export default function Process() {
  const line = useReveal<HTMLDivElement>()

  return (
    <Section id="process" tone="dark">
      <SectionHead
        en="Process"
        title="制作・相談の流れ"
        lead="無料相談からご提案・お見積もりを経て、内容にご納得いただいた上で制作へ進みます。"
        dark
      />

      <div className="relative">
        {/* 接続ライン（PCのみ） */}
        <div ref={line.ref}
          className={`process-line ${line.visible ? 'is-visible' : ''}
            hidden lg:block absolute top-[1.15rem] left-0 right-0 h-px bg-white/15`}
          aria-hidden="true" />

        <ol className="relative grid gap-7 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {PROCESS.map((step, i) => (
            <Reveal key={step.num} as="li"
              delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}>
              {/* 番号バッジ */}
              <div className="flex items-center gap-3 mb-4">
                <span className="shrink-0 w-9 h-9 rounded-full bg-white text-navy
                  text-[13px] font-bold flex items-center justify-center">
                  {step.num}
                </span>
                <span className="lg:hidden h-px flex-1 bg-white/15" aria-hidden="true" />
              </div>

              <h3 className="text-[15px] text-white mb-2.5">{step.title}</h3>
              <p className="text-[13.5px] leading-[1.85] text-white/65">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  )
}
