/**
 * 各セクション共通の背景装飾（Hero以外）。
 *
 * 「AI・業務改善・デジタル化」を連想させる、ごく控えめな要素だけで構成する。
 * ・柔らかい光がゆっくり呼吸する（拡大縮小＋わずかな明滅）
 * ・2つのノードを結ぶ細いデータラインと、その上を流れる小さなパケット
 * 実在する画面を模したものではなく、装飾に徹する（aria-hidden）。
 *
 * tone によって色味を変え、セクションが切り替わるたびに空気感が
 * わずかに変化するようにしている。seed で位置・角度・周期を
 * セクションごとにずらし、同じ模様の反復に見えないようにする。
 *
 * 奥行き：外側のラッパーが data-parallax の --p を使って層ごとに
 * 異なる速度で移動し、内側の要素が呼吸・移動のアニメーションを担う
 * （transform の競合を避けるため2段階に分けている）。
 */

type Tone = 'navy' | 'paper' | 'deep'

const PALETTE: Record<Tone, { glow: string; line: string; node: string }> = {
  navy:  { glow: 'rgba(92, 142, 222, 0.16)', line: 'rgba(150, 190, 245, 0.18)', node: 'rgba(212, 184, 122, 0.65)' },
  deep:  { glow: 'rgba(92, 142, 222, 0.13)', line: 'rgba(150, 190, 245, 0.15)', node: 'rgba(212, 184, 122, 0.55)' },
  paper: { glow: 'rgba(70, 96, 150, 0.08)',  line: 'rgba(70, 90, 130, 0.13)',   node: 'rgba(122, 95, 38, 0.5)' },
}

// seed から見た目のばらつきを作る簡易な擬似乱数（-1〜1）
function wobble(seed: number, salt: number) {
  const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

export default function SectionAmbience({
  tone, seed = 0,
}: { tone: Tone; seed?: number }) {
  const c = PALETTE[tone]
  const fromRight = seed % 2 === 0

  const glowPos  = 6 + Math.abs(wobble(seed, 1)) * 30   // 6〜36%
  const glowTop  = -8 + wobble(seed, 2) * 22             // -30〜14%
  const glowDur  = 22 + (seed % 5) * 3                   // 22〜34s

  const lineLeft = 12 + Math.abs(wobble(seed, 3)) * 62   // 12〜74%
  const lineTop  = 18 + Math.abs(wobble(seed, 4)) * 52   // 18〜70%
  const lineLen  = 108 + (seed % 4) * 16                 // 108〜156px
  const angle    = 14 + wobble(seed, 5) * 26              // -12〜40deg
  const packetDur = 13 + (seed % 4) * 2                   // 13〜19s

  return (
    <div className="sec-amb" aria-hidden="true">
      {/* 背景光：最も大きく動く層 */}
      <span
        className="sec-glow-parallax sec-amb-back"
        data-parallax
        style={{
          [fromRight ? 'right' : 'left']: `${glowPos}%`,
          top: `${glowTop}%`,
        }}
      >
        <span
          className="sec-glow"
          style={{
            background: `radial-gradient(circle, ${c.glow} 0%, transparent 70%)`,
            animationDuration: `${glowDur}s`,
          }}
        />
      </span>

      {/* データライン＋ノード＋流れるパケット：控えめに動く層 */}
      <span
        className="sec-line-parallax sec-amb-mid"
        data-parallax
        style={{ left: `${lineLeft}%`, top: `${lineTop}%` }}
      >
        <span
          className="sec-line-wrap"
          style={{
            width: `${lineLen}px`,
            transform: `rotate(${angle}deg)`,
            ['--line-len' as string]: `${lineLen}px`,
          }}
        >
          <span className="sec-line" style={{ background: c.line }} />
          <span className="sec-node" style={{ left: -2, background: c.node }} />
          <span className="sec-node"
            style={{ left: lineLen - 3, background: c.node, animationDelay: '2.4s' }} />
          <span className="sec-packet"
            style={{ background: c.node, animationDuration: `${packetDur}s` }} />
        </span>
      </span>
    </div>
  )
}
