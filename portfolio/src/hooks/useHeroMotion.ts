import { useEffect, type RefObject } from 'react'

/**
 * ファーストビューの視差（パララックス）を制御する。
 *
 * 設計方針
 * - React の再レンダリングを起こさず、CSS カスタムプロパティだけを更新する
 * - 更新は requestAnimationFrame で1フレーム1回に間引く
 * - マウス連動は PC（細かいポインタ かつ 1024px以上）のみ
 * - Hero が画面外にあるあいだは計算を止める
 * - prefers-reduced-motion では何もしない（変数未設定＝変位ゼロ）
 *
 * 設定する変数
 *   --mx : 画面中心を 0 とした横位置（-1〜1）
 *   --my : 画面中心を 0 とした縦位置（-1〜1）
 *   --sy : Hero を1画面ぶんスクロールした割合（0〜1）
 */
export function useHeroMotion(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // マウス連動は PC のみ。タッチ端末では有効にしない。
    const pointerEnabled = window.matchMedia(
      '(pointer: fine) and (min-width: 1024px)',
    ).matches

    let mx = 0
    let my = 0
    let sy = 0
    let frame = 0
    let inView = true

    const commit = () => {
      frame = 0
      el.style.setProperty('--mx', mx.toFixed(3))
      el.style.setProperty('--my', my.toFixed(3))
      el.style.setProperty('--sy', sy.toFixed(3))
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(commit)
    }

    const clamp = (v: number) => (v < -1 ? -1 : v > 1 ? 1 : v)

    const onPointerMove = (e: PointerEvent) => {
      if (!inView) return
      const vw = window.innerWidth
      const vh = window.innerHeight
      if (vw <= 0 || vh <= 0) return
      mx = clamp((e.clientX / vw - 0.5) * 2)
      my = clamp((e.clientY / vh - 0.5) * 2)
      schedule()
    }

    const onScroll = () => {
      const vh = window.innerHeight
      // ビューポート高さが取れない場合はゼロ除算になるため 0 に倒す
      const next = vh > 0
        ? Math.min(Math.max(window.scrollY / vh, 0), 1)
        : 0
      if (Math.abs(next - sy) < 0.001) return
      sy = next
      schedule()
    }

    // Hero が画面外に出たら計算と背景アニメーションを止める
    // （is-off クラスで animation-play-state を paused にする）
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        el.classList.toggle('is-off', !entry.isIntersecting)
      },
      { threshold: 0 },
    )
    observer.observe(el)

    if (pointerEnabled) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // 初期値を必ず書き込む（未設定のまま残さない）
    onScroll()
    commit()

    return () => {
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
      if (pointerEnabled) window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      el.classList.remove('is-off')
    }
  }, [ref])
}
