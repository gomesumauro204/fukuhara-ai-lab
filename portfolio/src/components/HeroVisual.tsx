/**
 * ファーストビュー中央の「光の柱」
 *
 * 設計方針
 * - 外部画像・動画を使わず CSS のみで構成（追加の転送量ゼロ）
 * - 主役は柔らかい光。ただし完全な抽象で終わらせず、
 *   「記録が積み上がり、整理されていく」ことが伝わる控えめな具象要素
 *   （記録の行・走査線・工程ラベル）を重ねる
 * - 実在しない画面やテキストは作らない
 */

/** 柱に沿って並ぶ工程ラベル */
const STEPS = ['記録', '整理', '検索', '共有'] as const

/** 記録の行：上ほど薄く、下ほどはっきり（積み上がりを示す） */
const ROWS = [
  { top: '20%', opacity: 0.25 },
  { top: '30%', opacity: 0.40 },
  { top: '40%', opacity: 0.55 },
  { top: '50%', opacity: 0.75 },
  { top: '60%', opacity: 0.55 },
  { top: '70%', opacity: 0.40 },
  { top: '80%', opacity: 0.25 },
] as const

export default function HeroVisual() {
  return (
    <div className="relative h-full w-full" aria-hidden="true">
      <div className="pillar h-full w-full">
        {/* 柔らかい光 */}
        <span className="pillar-glow pillar-glow-a" />
        <span className="pillar-glow pillar-glow-b" />

        {/* 記録の行 */}
        {ROWS.map(row => (
          <span
            key={row.top}
            className="pillar-row"
            style={{ top: row.top, opacity: row.opacity }}
          />
        ))}

        {/* 中央の1件だけ状態が切り替わっている（重要フラグの示唆） */}
        <span className="absolute left-[14%] top-[calc(50%-9px)]
          w-[3px] h-[18px] rounded-full bg-gold/70" />

        {/* 下から上へ通過する走査線 */}
        <span className="pillar-scan" />

        {/* 縦の枠線 */}
        <span className="pillar-frame" />
      </div>

      {/*
        工程ラベル：柱の右外側に置く。
        左側は説明文・CTAが入るため、重なりを避けて右へ寄せている。
      */}
      <ul className="absolute left-full ml-5 top-[58%] -translate-y-1/2
        hidden lg:flex flex-col gap-9">
        {STEPS.map((step, i) => (
          <li key={step} className="flex items-center gap-2.5 whitespace-nowrap">
            <span className="w-4 h-px bg-gold/35" />
            <span className="font-en text-[9px] text-gold-bright leading-none">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-white/55 tracking-[0.24em]">
              {step}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
