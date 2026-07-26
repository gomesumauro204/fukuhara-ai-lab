import { PROCESS } from '../data/site'
import { Section, SectionHead, Reveal, useInView } from './ui'

/** 制作・相談の流れ：接続線を1本描画し、番号で進行を示す */
export default function Process() {
  const line = useInView<HTMLDivElement>()

  return (
    <Section id="process" tone="navy">
      <SectionHead
        num="05"
        en="Process"
        title="制作・相談の流れ"
        lead="無料相談からご提案・お見積もりを経て、内容にご納得いただいた上で制作へ進みます。"
        dark
      />

      <div className="relative">
        {/* 接続線（PCのみ） */}
        <div
          ref={line.ref}
          aria-hidden="true"
          className={`draw-x ${line.inView ? 'is-in' : ''}
            hidden lg:block absolute top-[9px] left-0 right-0 h-px bg-white/12`}
        />

        <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {PROCESS.map((step, i) => (
            <Reveal key={step.num} as="li"
              delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              {/* 節点 */}
              <span aria-hidden="true"
                className="block w-[18px] h-[18px] rounded-full
                  border border-gold/60 bg-navy mb-6
                  grid place-items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              </span>

              <p className="font-en text-[11px] text-gold-bright mb-2"
                style={{ letterSpacing: '0.28em' }}>
                {step.num}
              </p>
              <h3 className="font-mincho text-[1.05rem] text-white mb-3">
                {step.title}
              </h3>
              <p className="text-[13px] leading-[1.95] text-white/60">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  )
}
