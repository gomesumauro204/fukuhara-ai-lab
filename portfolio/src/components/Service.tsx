import { SERVICES } from '../data/site'
import { Section, SectionHead, Reveal } from './ui'

/**
 * 支援内容：ヒアリング風景の写真をセクション全体の背景として使い、
 * 「その場に立ち会っているような」世界観を作る。
 *
 * 写真は右寄せで人物・PCが見える位置に配置し、左側は濃いネイビーの
 * グラデーションで覆って文章を最優先で読める状態にする
 * （画像レイヤー→オーバーレイ→コンテンツの3層構造）。
 */
export default function Service() {
  return (
    <Section
      id="service"
      tone="navy"
      accent="teal"
      background={
        <div className="svc-photo-wrap" aria-hidden="true">
          <picture>
            <source media="(max-width: 767px)" srcSet="/service-consulting-sm.webp" />
            <img
              src="/service-consulting.webp"
              alt=""
              width={1600}
              height={901}
              loading="lazy"
              decoding="async"
              data-parallax
              className="svc-photo"
            />
          </picture>
          <div className="svc-photo-overlay" />
        </div>
      }
    >
      <SectionHead
        num="02"
        en="Service"
        title="支援内容"
        lead="業務の整理から、ツールの設計・開発、導入後の改善までを一貫して担当します。"
        dark
      />

      <div className="max-w-2xl border-t border-white/10">
        {SERVICES.map((service, i) => (
          <Reveal key={service.num}
            kind="body"
            delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
            className="grid sm:grid-cols-[auto_1fr]
              gap-x-8 gap-y-3 items-baseline
              border-b border-white/10 py-8 lg:py-10">
            <span aria-hidden="true"
              className="font-en text-[2.4rem] lg:text-[3rem] leading-none
                select-none"
              style={{ color: 'var(--accent, rgba(255,255,255,0.12))', opacity: 0.35 }}>
              {service.num}
            </span>

            <div>
              <h3 className="font-mincho text-[1.15rem] lg:text-[1.35rem] text-white mb-3">
                {service.title}
              </h3>
              <p className="text-[14px] leading-[2] text-white/65 max-w-xl">
                {service.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
