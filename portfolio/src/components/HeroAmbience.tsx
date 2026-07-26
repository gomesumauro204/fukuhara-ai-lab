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
  { left: '8%',  top: '18%', len: 140, angle: 22,  duration: '11s' },
  { left: '78%', top: '64%', len: 160, angle: -16, duration: '13s' },
  { left: '58%', top: '30%', len: 100, angle: 34,  duration: '10s' },
] as const

/** AIチップ（小さな矩形＋ピン）。回路基板の部品を連想させる */
const CHIPS = [
  { left: '15%', top: '48%' },
  { left: '86%', top: '38%' },
] as const

/**
 * 流れ星のように斜めへ走る光の筋。
 *
 * 主役はAIチップ→見出しへの視線リレーであり、この光は「背景に
 * 存在を感じる」程度の脇役に留める。見出し〜CTAが順番に現れる
 * 0〜5.5秒の間は鳴りを潜め（最初の1本目も6.5秒以降）。以降は
 * 8〜11秒に一度、やや速めのテンポで流れる（本数は9本に増加）。
 */
const STREAKS = [
  { top: '9%',  left: '58%', angle: 27, len: 220, duration: '8s',  delay: '6.5s' },
  { top: '16%', left: '14%', angle: 24, len: 200, duration: '9s',  delay: '8.6s' },
  { top: '5%',  left: '82%', angle: 31, len: 190, duration: '8.5s', delay: '10.4s' },
  { top: '28%', left: '40%', angle: 22, len: 210, duration: '10s', delay: '7.3s' },
  { top: '13%', left: '34%', angle: 29, len: 190, duration: '8.7s', delay: '11.8s' },
  { top: '24%', left: '68%', angle: 25, len: 210, duration: '10.5s', delay: '9.5s' },
  { top: '3%',  left: '46%', angle: 33, len: 180, duration: '9.3s', delay: '12.6s' },
  { top: '20%', left: '88%', angle: 26, len: 195, duration: '9.6s', delay: '7.9s' },
  { top: '32%', left: '20%', angle: 30, len: 205, duration: '8.8s', delay: '13.5s' },
] as const

export default function HeroAmbience() {
  return (
    <div className="amb" aria-hidden="true">
      {/* 広い背景光：19〜24秒周期でごくゆっくり移動しながら呼吸する */}
      <span className="amb-glow amb-glow-a" />
      <span className="amb-glow amb-glow-b" />

      {/* 流れ星のような光の筋 */}
      {STREAKS.map((s, i) => (
        <span
          key={s.top + s.left}
          className={`hero-streak ${i >= 4 ? 'hidden sm:block' : ''}`}
          style={{
            top: s.top,
            left: s.left,
            width: `${s.len}px`,
            transform: `rotate(${s.angle}deg)`,
            ['--streak-duration' as string]: s.duration,
            ['--streak-delay' as string]: s.delay,
          }}
        >
          <span className="hero-streak-line" />
        </span>
      ))}

      {/* 情報の流れを思わせる細い線 */}
      <span className="amb-line amb-line-v1" />
      <span className="amb-line amb-line-v2" />
      <span className="amb-line amb-line-h1" />

      {/* ノードを結ぶデータライン（タブレット以上） */}
      {NETWORK.map(n => (
        <span
          key={n.left + n.top}
          className="amb-network hidden sm:block"
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
            <span className="sec-line" style={{ background: 'rgba(150, 190, 245, 0.3)' }} />
            <span className="sec-node" style={{ left: -2, background: 'rgba(212, 184, 122, 0.85)' }} />
            <span className="sec-node"
              style={{ left: n.len - 3, background: 'rgba(212, 184, 122, 0.85)', animationDelay: '2.4s' }} />
            <span className="sec-packet"
              style={{ background: 'rgba(212, 184, 122, 0.9)', animationDuration: n.duration }} />
          </span>
        </span>
      ))}

      {/* AIチップ（回路基板の部品を連想させる小さな矩形）タブレット以上 */}
      {CHIPS.map(chip => (
        <span
          key={chip.left + chip.top}
          className="sec-chip hidden sm:block"
          style={{ left: chip.left, top: chip.top, color: 'rgba(150,190,245,0.6)', borderColor: 'rgba(150,190,245,0.6)' }}
        />
      ))}

      {/* 処理フローカード（半透明パネル） */}
      <span
        className="sec-card hidden lg:block"
        style={{
          left: '68%', top: '14%',
          color: 'rgba(150,190,245,0.35)', borderColor: 'rgba(150,190,245,0.35)',
          background: 'rgba(150,190,245,0.04)',
        }}
      />

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
