import { SITE } from '../data/site'

/**
 * ロゴ：細枠の正方形マーク + 日本語社名 + 極小英字
 * dark = 濃色背景に置く場合（既定）
 */
export default function Logo({ dark = true }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`grid place-items-center w-10 h-10 shrink-0 rounded-[3px]
          border font-en text-[17px] leading-none pt-0.5
          ${dark ? 'border-gold/55 text-gold' : 'border-ink/30 text-ink'}`}
      >
        {SITE.mark}
      </span>

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
