import { WORKS } from '../data/works'
import { Section } from './ui'
import WorksScene from './WorksScene'

/**
 * 制作実績
 *
 * サイトで最も重要なセクション。各実績を「スクロールシーン」として
 * 実装しており、静的な一覧ではなく、スクロールに応じて主役が
 * 番号・見出し → ツール名 → ビジュアル → 課題 → 機能 → CTA と
 * 段階的に入れ替わる（詳細は WorksScene / useScrollScene を参照）。
 *
 * セクション見出し（01 / WORKS / 制作実績）は、静的な SectionHead では
 * なく各シーンの Stage 1 として動的に表示されるため、bare でラップして
 * 通常の余白付きコンテナを使わない。
 */
export default function Works() {
  return (
    <Section id="works" tone="navy" bare>
      {WORKS.map((work, i) => (
        <WorksScene key={work.title} work={work} index={i} />
      ))}
    </Section>
  )
}
