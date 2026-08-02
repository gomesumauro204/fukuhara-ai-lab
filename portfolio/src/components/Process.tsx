import { PROCESS } from '../data/site'
import { Section, SectionHead, Reveal } from './ui'

/**
 * 制作・相談の流れ：開発風景の写真をセクション全体の背景として使う。
 *
 * 情報量の多い写真のため、暗いオーバーレイと軽いぼかしで沈め、
 * 工程カードは半透明の板を敷いて画像の上に浮かぶように見せる。
 * 5工程を「流れ」として見せるため、接続線をゴールド→ティール→
 * プラムのグラデーションにし、節点の色も工程ごとに少しずつ変える。
 * 接続線は一度きりの演出ではなく、サイト共通のスクロール連動の仕組み
 * （data-parallax・--p）でスクロール量にそのまま比例して伸びる
 * ＝「工程を進んでいく」感覚を強める。
 */
const STEP_ACCENTS = ['#C9A961', '#82C4BC', '#A79CD1', '#C79BB6', '#9CCBA4']

export default function Process() {
  return (
    <Section
      id="process"
      tone="navy"
      accent="forest"
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
        {/* 接続線（PC・横方向）：スクロール量にそのまま連動して伸び、
            先端に現在地を示す光点が付く */}
        <div data-parallax aria-hidden="true"
          className="hidden lg:block absolute top-[9px] left-0 right-0 h-[3px]">
          <span className="proc-flowline absolute inset-0"
            style={{ background: 'linear-gradient(90deg, #C9A961, #82C4BC, #A79CD1, #C79BB6)' }} />
          <span className="proc-flowline-dot" />
        </div>

        {/* 接続線（スマホ・縦方向）：カードが縦1列に並ぶため、
            同じ考え方を縦の線に置き換える */}
        <div data-parallax aria-hidden="true"
          className="sm:hidden absolute top-1 bottom-1 left-[9px] w-[3px]">
          <span className="proc-flowline-v absolute inset-0"
            style={{ background: 'linear-gradient(180deg, #C9A961, #82C4BC, #A79CD1, #C79BB6)' }} />
          <span className="proc-flowline-v-dot" />
        </div>

        <ol className="relative grid gap-5 pl-8 sm:pl-0 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {PROCESS.map((step, i) => (
            <Reveal key={step.num} as="li"
              delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
              className="proc-card rounded-md p-5 lg:p-6">
              {/* 節点：工程ごとに色を変え、流れを可視化する */}
              <span aria-hidden="true"
                className="block w-[18px] h-[18px] rounded-full bg-navy mb-6
                  grid place-items-center"
                style={{ border: `1px solid ${STEP_ACCENTS[i % STEP_ACCENTS.length]}` }}>
                <span className="w-1.5 h-1.5 rounded-full"
                  style={{ background: STEP_ACCENTS[i % STEP_ACCENTS.length] }} />
              </span>

              <p className="font-en text-[11px] mb-2"
                style={{ letterSpacing: '0.28em', color: STEP_ACCENTS[i % STEP_ACCENTS.length] }}>
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
