import { useEffect } from 'react'

/**
 * サイト全体の軽量パララックス。
 *
 * `data-parallax` を付けた要素すべてに対して、画面を通過する進み具合
 * （0〜1）を CSS カスタムプロパティ --p として書き込む。
 * 各要素の内部では、この --p を異なる係数で使うことで
 * 「背景・装飾線・画像がそれぞれ少し違う速度で動く」奥行きを作る。
 * 本文（見出し・段落）には適用しない — 可読性を最優先するため、
 * 動かすのは装飾要素と画像のみ。
 *
 * 設計方針
 * - グローバルに1つの scroll リスナーだけを使う（要素ごとに
 *   IntersectionObserver を持たせない。数十個でも計算コストは小さい）
 * - 更新は requestAnimationFrame で1フレーム1回に間引く
 * - 画面の上下から離れた要素は計算をスキップする
 * - prefers-reduced-motion では何もしない
 */
export function useSectionParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const margin = 240 // このpx分だけ画面外でも計算対象にする

    const commit = () => {
      frame = 0
      const vh = window.innerHeight
      if (vh <= 0) return

      const els = document.querySelectorAll<HTMLElement>('[data-parallax]')
      els.forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.bottom < -margin || rect.top > vh + margin) return

        // 要素が画面下端に入った瞬間を 0、画面上端を抜ける瞬間を 1 とする
        const total = vh + rect.height
        const progress = (vh - rect.top) / total
        const clamped = progress < 0 ? 0 : progress > 1 ? 1 : progress
        el.style.setProperty('--p', clamped.toFixed(3))
      })
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(commit)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    commit()

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])
}
