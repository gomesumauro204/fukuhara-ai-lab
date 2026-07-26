import { useEffect, useRef } from 'react'

/**
 * ピン留め（sticky）シーンのスクロール進捗を、6つのステージ進捗
 * （--s1〜--s6、それぞれ0〜1）としてCSS変数に書き込む。
 *
 * 仕組み
 * - ref を付けた要素（高さ = 画面何個分もある「シーン全体」）が
 *   画面を通過する割合を --sp（0〜1）として計算する
 * - --sp をあらかじめ決めた6つの区間に分割し、区間ごとの
 *   ローカル進捗を --s1〜--s6 として書き込む
 * - 要素側は CSS の calc()/clamp() だけでこれらの変数を参照し、
 *   opacity・transform を組み立てる（Reactの再描画は起こさない）
 *
 * 区間は少しずつ重なっている（次のステージが始まる前に前のステージの
 * 進捗が1へ達する）ため、CSS側で「前の要素の退場」と「次の要素の
 * 登場」を同時に計算でき、自然なクロスフェードになる。
 */
const STAGES = [
  [0.00, 0.16],
  [0.14, 0.32],
  [0.30, 0.48],
  [0.46, 0.64],
  [0.62, 0.80],
  [0.78, 1.00],
] as const

export function useScrollScene<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // 動きを減らす設定では、最終状態（すべて表示済み）に固定する
      el.style.setProperty('--sp', '1')
      STAGES.forEach((_, i) => el.style.setProperty(`--s${i + 1}`, '1'))
      return
    }

    let frame = 0
    const commit = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height - vh
      const raw = total > 0 ? -rect.top / total : 0
      const sp = raw < 0 ? 0 : raw > 1 ? 1 : raw
      el.style.setProperty('--sp', sp.toFixed(4))

      STAGES.forEach(([start, end], i) => {
        const local = (sp - start) / (end - start)
        const clamped = local < 0 ? 0 : local > 1 ? 1 : local
        el.style.setProperty(`--s${i + 1}`, clamped.toFixed(4))
      })
    }

    const schedule = () => { if (!frame) frame = requestAnimationFrame(commit) }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    commit()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return ref
}
