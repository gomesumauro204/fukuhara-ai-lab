import { PROBLEMS } from '../data/site'
import { Section, SectionHead, Reveal, useInView } from './ui'

/**
 * 課題：写真・罫線・カードを使わず、ネイビーの世界観のまま
 * 背景だけに奥行きを出す。前景（見出し・説明文・7項目）の
 * レイアウトはそのまま、背面は3層構造にする。
 *   奥　　… ネイビーの立体的なグラデーション（静的な土台）
 *   中間　… 青紫・ゴールドの光レイヤー（スクロールに応じて
 *           移動しながらわずかに呼吸する）
 *   手前　… 奥・手前2層に分けた光の粒（速度差だけで奥行きを作る）
 *
 * Heroの背景演出とは意図的に別物にしている：
 * ・Heroは時間ベースの無限ループ（常に動き続ける「主役級」の演出）
 * ・こちらはスクロール位置だけに連動し、止まれば完全に静止する
 *   （要素数・明るさの上限もHeroより大きく抑え、線やチップは使わない）
 * 対応ブラウザではCSS scroll-driven animationで実スクロール連動、
 * 非対応ブラウザは一度だけのゆっくりした移動にフォールバックする。
 */
export default function Problem() {
  return (
    <Section
      id="problem"
      tone="navy"
      ambience={false}
      background={<ProblemBackground />}
    >
      <SectionHead
        num="01"
        en="Issues"
        title="こんな業務が、そのままになっていませんか。"
        lead="どれか一つでも当てはまる場合、業務の整理とツール化で改善できる余地があります。"
        dark
      />

      <ul className="relative space-y-5 sm:space-y-6">
        {PROBLEMS.map((problem, i) => (
          <Reveal key={problem} as="li" kind="body"
            delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
            className="flex items-baseline gap-5 sm:gap-8">
            <span className="font-en text-[12px] text-gold-bright shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-[14.5px] sm:text-[15.5px] leading-[1.8] text-white/80">
              {problem}
            </span>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}

// =================================================================
// 背景：奥（ネイビーの土台）→ 中間（光の層×2）→ 奥の光点／手前の光点
// （速度差だけで奥行きを作る）の3層構造。線・図形・点滅は使わない。
// =================================================================

/** 奥の光点：小さく・暗く・動きが小さい（遠くにあるように見せる） */
const STARS_FAR = [
  { top: '14%', left: '72%' },
  { top: '26%', left: '18%' },
  { top: '58%', left: '85%' },
  { top: '78%', left: '10%' },
] as const

/** 手前の光点：やや大きく・やや明るく・動きが大きい（近くにあるように見せる） */
const STARS_NEAR = [
  { top: '20%', left: '88%' },
  { top: '46%', left: '6%' },
  { top: '84%', left: '80%' },
] as const

function ProblemBackground() {
  const decor = useInView<HTMLDivElement>()

  return (
    <div ref={decor.ref}
      className={`problem-decor absolute inset-0 z-0 overflow-hidden
        ${decor.inView ? 'is-in' : ''}`}
      aria-hidden="true"
    >
      {/* 奥：ネイビーの立体的なグラデーション */}
      <span className="problem-base" />

      {/* 中間：光の層（スクロールに応じて移動＋わずかに呼吸） */}
      <span className="problem-layer-a" />
      <span className="problem-layer-b" />

      {/* 奥・手前2層の光点。速度差（移動量の差）だけで奥行きを作る。
          Heroの粒子より数を絞り、明るさの上限も低く抑えている。 */}
      <ul className="problem-stars">
        {STARS_FAR.map((s, i) => (
          <li key={`far-${i}`} className="problem-star problem-star-far"
            style={{ top: s.top, left: s.left }} />
        ))}
        {STARS_NEAR.map((s, i) => (
          <li key={`near-${i}`} className="problem-star problem-star-near"
            style={{ top: s.top, left: s.left }} />
        ))}
      </ul>

      <span className="problem-grain" />
    </div>
  )
}
