import { PROBLEMS } from '../data/site'
import { Section, SectionHead, Reveal } from './ui'

/** 顧客が抱えやすい課題：カードを並べず、罫線のリストで静かに見せる */
export default function Problem() {
  return (
    <Section id="problem" tone="paper">
      <SectionHead
        num="02"
        en="Issues"
        title="こんな業務が、そのままになっていませんか。"
        lead="どれか一つでも当てはまる場合、業務の整理とツール化で改善できる余地があります。"
      />

      <ul className="border-t border-ink/12">
        {PROBLEMS.map((problem, i) => (
          <Reveal key={problem} as="li" kind="body"
            delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
            className="flex items-baseline gap-5 sm:gap-8
              border-b border-ink/12 py-5">
            <span className="font-en text-[12px] text-gold-deep shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-[14.5px] sm:text-[15.5px] leading-[1.8] text-ink">
              {problem}
            </span>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
