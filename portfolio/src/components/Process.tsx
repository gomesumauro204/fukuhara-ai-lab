import { PROCESS } from '../data/site'
import { Section, SectionHead, Reveal, useInView } from './ui'

/**
 * 制作・相談の流れ：開発風景の写真をセクション全体の背景として使う。
 *
 * 情報量の多い写真のため、暗いオーバーレイと軽いぼかしで沈め、
 * 工程カードは半透明の板を敷いて画像の上に浮かぶように見せる。
 */
export default function Process() {
  const line = useInView<HTMLDivElement>()

  return (
    <Section
      id="process"
      tone="navy"
      background={
        <div className="proc-photo-wrap" aria-hidden="true">
          <picture>
            <source media="(max-width: 767px)" srcSet="/process-development-sm.webp" />
            <img
              src="/process-development.webp"
              alt=""
              width={1600}
              height={901}
              loading="lazy"
              decoding="async"
              className="proc-photo"
            />
          </picture>
          <div className="proc-photo-overlay" />
        </div>
      }
    >
      <SectionHead
        num="07"
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
            hidden lg:block absolute top-[9px] left-0 right-0 h-px bg-white/20`}
        />

        <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {PROCESS.map((step, i) => (
            <Reveal key={step.num} as="li"
              delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
              className="proc-card rounded-md p-5 lg:p-6">
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
              <p className="text-[13px] leading-[1.95] text-white/70">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  )
}
