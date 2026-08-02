import { SITE } from '../data/site'

/**
 * ロゴ：正方形マーク画像（public/logo/fa-logo.png） + 日本語社名 + 極小英字
 * dark = 濃色背景に置く場合（既定）
 *
 * マーク画像は透過PNG（背景は完全に透明）で、縦横比1:1。
 * object-containで縦横比を保ったまま正方形の枠に収める。
 * スマホ30px／sm以上36px（いずれも要件のPC32〜40px・スマホ28〜34pxの範囲内）。
 */
export default function Logo({ dark = true }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <img
        src="/logo/fa-logo.png"
        alt=""
        aria-hidden="true"
        className="w-[30px] h-[30px] sm:w-9 sm:h-9 shrink-0 object-contain"
      />

      <span className="flex flex-col leading-none">
        <span className={`text-[14px] sm:text-[15px] font-semibold tracking-tight
          ${dark ? 'text-white' : 'text-ink'}`}>
          {SITE.name}
        </span>
        <span className={`font-en text-[8.5px] uppercase mt-1
          ${dark ? 'text-white/60' : 'text-ink-soft'}`}
          style={{ letterSpacing: '0.28em' }}>
          {SITE.nameEn}
        </span>
      </span>
    </span>
  )
}
