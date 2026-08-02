import { SITE } from '../data/site'

/**
 * ロゴ：正方形マーク画像（public/logo/fa-logo.png） + 日本語社名 + 極小英字
 * dark = 濃色背景に置く場合（既定）
 * emphasize = ロゴの背後に小さな半透明ベースを敷き、暗い背景に沈まないようにする
 *   （ヘッダーのみで使用。画像自体は変更せず、表示方法だけを調整する）
 *
 * マーク画像は透過PNG（背景は完全に透明）で、縦横比1:1。
 * object-containで縦横比を保ったまま正方形の枠に収める。
 * スマホ30px／sm以上36px（いずれも要件のPC32〜40px・スマホ28〜34pxの範囲内）。
 * emphasize時も外枠のサイズは同じなので、ヘッダーの高さ・余白は変わらない。
 */
export default function Logo({ dark = true, emphasize = false }: { dark?: boolean; emphasize?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      {emphasize ? (
        <span className="relative grid place-items-center w-[30px] h-[30px] sm:w-9 sm:h-9
          shrink-0 rounded-[8px] border border-gold/30 bg-navy-deep/55
          shadow-[0_0_9px_rgba(212,175,55,0.22)]">
          <img
            src="/logo/fa-logo.png"
            alt=""
            aria-hidden="true"
            className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] object-contain"
            style={{ filter: 'brightness(1.14) contrast(1.03)' }}
          />
        </span>
      ) : (
        <img
          src="/logo/fa-logo.png"
          alt=""
          aria-hidden="true"
          className="w-[30px] h-[30px] sm:w-9 sm:h-9 shrink-0 object-contain"
        />
      )}

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
