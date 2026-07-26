import { PROBLEMS } from '../data/site'
import { Section, SectionHead, Reveal } from './ui'

export default function Problem() {
  return (
    <Section id="problem" tone="soft">
      <SectionHead
        en="Issues"
        title="こんな業務が、そのままになっていませんか。"
        lead="どれか一つでも当てはまる場合、業務の整理とツール化で改善できる余地があります。"
      />

      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {PROBLEMS.map((problem, i) => (
          <Reveal key={problem} as="li"
            delay={((i % 3) + 1) as 1 | 2 | 3}
            className="bg-white border border-surface-line rounded-md
              px-5 py-5 flex items-start gap-3">
            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full
              bg-accent-light text-accent flex items-center justify-center
              text-[11px] font-bold" aria-hidden="true">
              {i + 1}
            </span>
            <span className="text-[14px] leading-[1.75] text-ink">
              {problem}
            </span>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
