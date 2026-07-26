/**
 * ファーストビューの背景アンビエンス（最背面のレイヤー）
 *
 * 設計方針
 * - 外部画像・動画を使わず CSS のみで構成する（転送量ゼロ）
 * - 動かすのは transform と opacity のみ。blur は静的にかけるだけで
 *   アニメーションさせない（再ラスタライズを避けるため）
 * - すべて低コントラスト。文字の可読性より前に出ない
 * - スマートフォンでは粒子と横線を表示せず、動きを弱める（CSS側で制御）
 */

/** ゆっくり漂う微細な粒子（PCのみ表示） */
const DUST = [
  { left: '11%', top: '64%', duration: '24s', delay: '0s' },
  { left: '19%', top: '38%', duration: '29s', delay: '4s' },
  { left: '31%', top: '78%', duration: '22s', delay: '9s' },
  { left: '68%', top: '56%', duration: '27s', delay: '2s' },
  { left: '77%', top: '30%', duration: '25s', delay: '13s' },
  { left: '86%', top: '70%', duration: '30s', delay: '7s' },
  { left: '58%', top: '85%', duration: '26s', delay: '17s' },
] as const

/**
 * ノード同士を結ぶ細いデータライン。AI・ネットワーク・情報の流れを
 * 連想させる要素として、Hero背景の四隅寄りに小さく配置する。
 * SF的な派手さではなく、Appleライクな控えめさを保つため
 * 線・ノード・パケットとも極細・低彩度にしている（PCのみ表示）。
 */
const NETWORK = [
  { left: '8%',  top: '20%', len: 130, angle: 22,  duration: '15s' },
  { left: '80%', top: '68%', len: 150, angle: -16, duration: '18s' },
] as const

export default function HeroAmbience() {
  return (
    <div className="amb" aria-hidden="true">
      {/* 広い背景光：19〜24秒周期でごくゆっくり移動しながら呼吸する */}
      <span className="amb-glow amb-glow-a" />
      <span className="amb-glow amb-glow-b" />

      {/* 情報の流れを思わせる細い線 */}
      <span className="amb-line amb-line-v1" />
      <span className="amb-line amb-line-v2" />
      <span className="amb-line amb-line-h1" />

      {/* ノードを結ぶデータライン（PCのみ） */}
      {NETWORK.map(n => (
        <span
          key={n.left + n.top}
          className="amb-network hidden lg:block"
          style={{ left: n.left, top: n.top }}
        >
          <span
            className="sec-line-wrap"
            style={{
              width: `${n.len}px`,
              transform: `rotate(${n.angle}deg)`,
              ['--line-len' as string]: `${n.len}px`,
            }}
          >
            <span className="sec-line" style={{ background: 'rgba(150, 190, 245, 0.2)' }} />
            <span className="sec-node" style={{ left: -2, background: 'rgba(212, 184, 122, 0.6)' }} />
            <span className="sec-node"
              style={{ left: n.len - 3, background: 'rgba(212, 184, 122, 0.6)', animationDelay: '2.4s' }} />
            <span className="sec-packet"
              style={{ background: 'rgba(212, 184, 122, 0.75)', animationDuration: n.duration }} />
          </span>
        </span>
      ))}

      {/* 微細な粒子 */}
      <ul className="amb-dust">
        {DUST.map(dot => (
          <li
            key={dot.left + dot.top}
            className="amb-dot"
            style={{
              left: dot.left,
              top: dot.top,
              animationDuration: dot.duration,
              animationDelay: dot.delay,
            }}
          />
        ))}
      </ul>

      {/* 薄いノイズ（タイル1枚ぶんだけ移動させて継ぎ目なくループ） */}
      <span className="amb-grain" />
    </div>
  )
}
