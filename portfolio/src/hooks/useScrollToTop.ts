import { useLayoutEffect } from 'react'

/**
 * ページ読み込み時のスクロール位置を安定させる。
 *
 * ブラウザは既定で history.scrollRestoration = 'auto' のため、
 * リロード時に「前回のスクロールY座標（px）」を復元しようとする。
 * セクションの並び順を変更すると、同じY座標でも意味するセクションが
 * 変わってしまい、URLにハッシュが無い通常のトップURLでも
 * 別セクションの途中から表示される、という問題が起きる。
 *
 * ハッシュ付きURL（#service など）でのアンカー移動は妨げず、
 * ハッシュが無い場合のみ確実にページ最上部から開始させる。
 */
export function useScrollToTop() {
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0)
    }
  }, [])
}
