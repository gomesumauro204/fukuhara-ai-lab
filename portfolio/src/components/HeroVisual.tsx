import { HeroFormationDesktop } from './HeroFormation'

/**
 * ファーストビュー中央の「光の柱」＝オープニング演出の主役。
 *
 * 設計方針
 * - 外部画像・動画を使わず CSS/SVG のみで構成（追加の転送量ゼロ）
 * - ページを開いてからの5秒間で、AIチップの輪郭・回路・ピンが
 *   段階的に組み上がり、中心のコアが点灯して静かな待機発光へ落ち着く
 *   （詳細タイムラインは index.css の chip-* を参照）
 * - 実在しない画面やテキストは作らない
 */

/** 柱に沿って並ぶ工程ラベル */
const STEPS = ['記録', '整理', '検索', '共有'] as const

export default function HeroVisual() {
  return (
    <div className="relative h-full w-full" aria-hidden="true">
      <div className="pillar h-full w-full flex items-center justify-center">
        {/* 柔らかい光（背景の呼吸） */}
        <span className="pillar-glow pillar-glow-a" />
        <span className="pillar-glow pillar-glow-b" />

        {/* AIチップ（演算コア）が組み上がるオープニング演出 */}
        <div className="relative w-[92%] max-w-[300px] aspect-[240/220]">
          <HeroFormationDesktop />
        </div>
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
