import { useEffect, useState } from 'react'
import { HERO_SHOWCASE, type ShowcaseItem, type ShowcaseKind } from '../data/heroShowcase'

/**
 * ヒーロー背景：斜めに流れる「業務画面」ショーケース
 *
 * 会議室の雰囲気だけでなく、ダッシュボード・入力フォーム・一覧・
 * 進捗管理・通知UIなどの「業務画面」が主役の動く背景にすることで、
 * 業務改善・Webツール開発のサービスであることを直感的に伝える。
 *
 * 構造：
 * - 列（グリッド全体）を斜めに回転させ、各列の中身を縦方向に
 *   等速ループさせることで、画面上は斜め方向へ流れて見える
 *   （plaportなどで使われる手法。回転はコンテナのみに適用し、
 *   カード自体は個別に回転させない）
 * - 各列は「同じカード列を2セット連結 → 50%だけ縦移動」で
 *   継ぎ目のない無限ループにする
 * - 列ごとに速度を少し変え、機械的すぎない自然な動きにする
 * - 画像は public/hero-showcase/{id}.webp を置けば自動で実画像に
 *   差し替わる。無い間はCSSのみの簡易モック画面（仮素材）を表示する
 * - テキストの可読性は Hero.tsx 側の .hero-photo-overlay が担う
 *   （このコンポーネント自身は暗幕を持たない）
 */

const COLUMN_COUNT = 3
const COLUMN_DURATIONS = ['46s', '54s', '40s']

export default function HeroShowcase() {
  const columns = Array.from({ length: COLUMN_COUNT }, (_, colIndex) =>
    HERO_SHOWCASE.filter((_, i) => i % COLUMN_COUNT === colIndex),
  )

  return (
    <div className="hero-showcase" aria-hidden="true">
      <div className="hero-showcase-grid">
        {columns.map((items, colIndex) => (
          <div
            key={colIndex}
            className={`hero-showcase-col hero-showcase-col-${colIndex}`}
          >
            <div
              className="hero-showcase-track"
              style={{ animationDuration: COLUMN_DURATIONS[colIndex % COLUMN_DURATIONS.length] }}
            >
              {/* 同じカード列を2セット連結し、50%移動で継ぎ目なくループさせる */}
              {[...items, ...items].map((item, i) => (
                <HeroShowcaseCard key={`${item.id}-${i}`} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 画像が置かれていれば実画像、無ければ種類別の簡易モック画面（仮素材）を表示 */
function HeroShowcaseCard({ item }: { item: ShowcaseItem }) {
  const exists = useShowcaseImageExists(item.id)

  return (
    <figure className="hero-showcase-card">
      {exists ? (
        <img
          src={`/hero-showcase/${item.id}.webp`}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          className="block w-full h-full object-cover"
        />
      ) : (
        <ShowcaseMock kind={item.kind} />
      )}
    </figure>
  )
}

function useShowcaseImageExists(id: string): boolean {
  const [exists, setExists] = useState(false)
  useEffect(() => {
    let alive = true
    const img = new Image()
    img.onload = () => alive && setExists(true)
    img.onerror = () => alive && setExists(false)
    img.src = `/hero-showcase/${id}.webp`
    return () => { alive = false }
  }, [id])
  return exists
}

/** 種類別の簡易モック画面（仮素材。最終的には実際の業務画面スクリーンショットに差し替える） */
function ShowcaseMock({ kind }: { kind: ShowcaseKind }) {
  return (
    <div className={`showcase-mock showcase-mock-${kind}`}>
      <div className="showcase-mock-bar">
        <span /><span /><span />
      </div>
      <div className="showcase-mock-body">
        {kind === 'dashboard' && (
          <>
            <div className="showcase-mock-kpi">
              <span className="showcase-mock-ring" />
              <span className="showcase-mock-line short" />
            </div>
            <div className="showcase-mock-bars">
              <i style={{ height: '40%' }} /><i style={{ height: '70%' }} />
              <i style={{ height: '55%' }} /><i style={{ height: '85%' }} />
            </div>
          </>
        )}
        {kind === 'form' && (
          <>
            <span className="showcase-mock-line" />
            <span className="showcase-mock-field" />
            <span className="showcase-mock-line" />
            <span className="showcase-mock-field" />
            <span className="showcase-mock-pill" />
          </>
        )}
        {kind === 'table' && (
          <div className="showcase-mock-rows">
            <div><i /><span /></div>
            <div><i /><span /></div>
            <div><i /><span /></div>
            <div><i /><span /></div>
          </div>
        )}
        {kind === 'progress' && (
          <div className="showcase-mock-progress">
            <span className="showcase-mock-track"><i style={{ width: '80%' }} /></span>
            <span className="showcase-mock-track"><i style={{ width: '45%' }} /></span>
            <span className="showcase-mock-track"><i style={{ width: '62%' }} /></span>
          </div>
        )}
        {kind === 'notify' && (
          <div className="showcase-mock-rows">
            <div><b /><span /></div>
            <div><b /><span /></div>
            <div><b /><span /></div>
          </div>
        )}
        {kind === 'calendar' && (
          <div className="showcase-mock-grid">
            {Array.from({ length: 12 }, (_, i) => <i key={i} />)}
          </div>
        )}
        {kind === 'flow' && (
          <div className="showcase-mock-flow">
            <span /><i /><span /><i /><span />
          </div>
        )}
        {kind === 'sync' && (
          <div className="showcase-mock-kpi">
            <span className="showcase-mock-ring" />
            <span className="showcase-mock-line short" />
            <span className="showcase-mock-line short" />
          </div>
        )}
      </div>
    </div>
  )
}
