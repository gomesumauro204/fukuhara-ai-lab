import { useEffect, useState } from 'react'

const SEEN_KEY = 'fal_intro_seen'
/** 通常時の表示時間（0.8〜1.0秒の範囲） */
const DURATION_MS = 900
/** prefers-reduced-motion時：即時表示に近い、ごく短いフェードのみ */
const REDUCED_DURATION_MS = 250

/**
 * 初回アクセス時のみ表示する「NOW LOADING」演出。
 *
 * - Hero は背後ですでに描画済み・自身のディレイもごく短い（index.css の
 *   .d1〜.d6 参照）。この画面はそれを覆い隠しているだけで、読み込みを
 *   待たせているわけではない（ローディングとヒーロー側の遅延を
 *   二重に発生させない設計）。
 * - 同一セッション中は sessionStorage で再表示しない。
 * - prefers-reduced-motionでは、ロゴ・文字・進捗ラインの動きは止め、
 *   ごく短いフェードのみで即時表示に近い形にする（非表示にはしない）。
 */
export default function BrandIntro() {
  const [show, setShow] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return
    sessionStorage.setItem(SEEN_KEY, '1')

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(isReduced)
    setShow(true)

    const timer = setTimeout(
      () => setShow(false),
      isReduced ? REDUCED_DURATION_MS : DURATION_MS,
    )
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div
      className={`brand-intro ${reduced ? 'brand-intro-reduced' : ''}`}
      aria-hidden="true"
    >
      <div className="brand-intro-inner">
        <img src="/logo/fa-logo.png" alt="" className="brand-intro-logo" />
        <p className="brand-intro-label font-en text-[15px] sm:text-[17px] uppercase text-gold">
          Now Loading
        </p>
        <span className="brand-intro-bar">
          <span className="brand-intro-bar-fill" />
        </span>
      </div>
    </div>
  )
}
