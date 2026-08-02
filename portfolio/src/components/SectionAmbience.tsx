import { useInView } from './ui'

/**
 * 各セクション共通の背景装飾（Hero以外）。
 *
 * 「AIがデータを処理し、情報がネットワーク上を流れている」ことを
 * 連想させる要素だけで構成する（星空・宇宙・ランダムな粒子にはしない）。
 *
 * 構成要素
 * ・背景光（呼吸するグロー）
 * ・データライン＋ノード＋流れるパケット
 *
 * tone によって色味と密度を変える。navy/deep（濃紺）では上記すべてを
 * フル density で表示し、paper（淡色）では光とラインのみに抑える。
 * seed で位置・角度・周期をセクションごとにずらす。
 *
 * 奥行き：.sec-amb-back / .sec-amb-mid が data-parallax の --p を使い、
 * 層ごとに違う速度で動く。.sec-amb-in はこのセクションに初めて
 * スクロールしたときの一度きりの立ち上がり（空気感の切り替わり）。
 */

type Tone = 'navy' | 'paper' | 'deep'
export type Accent = 'gold' | 'plum' | 'purple' | 'teal' | 'forest'

const PALETTE: Record<Tone, { glow: string; line: string; node: string }> = {
  navy:  { glow: 'rgba(92, 142, 222, 0.22)', line: 'rgba(150, 190, 245, 0.28)', node: 'rgba(212, 184, 122, 0.85)' },
  deep:  { glow: 'rgba(92, 142, 222, 0.19)', line: 'rgba(150, 190, 245, 0.24)', node: 'rgba(212, 184, 122, 0.75)' },
  paper: { glow: 'rgba(70, 96, 150, 0.10)',  line: 'rgba(70, 90, 130, 0.16)',   node: 'rgba(122, 95, 38, 0.55)' },
}

/* セクションごとの差し色。背景光（glow）だけをこの色に寄せ、
   データラインのノード（gold）は全セクション共通の署名として残す。
   ネイビー一色に見えないための、ごく控えめな色の変化。 */
const ACCENT_GLOW: Record<Tone, Partial<Record<Accent, string>>> = {
  navy: {
    plum:   'rgba(199, 155, 182, 0.20)',
    purple: 'rgba(167, 156, 209, 0.20)',
    teal:   'rgba(130, 196, 188, 0.20)',
    forest: 'rgba(156, 203, 164, 0.20)',
  },
  deep: {
    plum:   'rgba(199, 155, 182, 0.17)',
    purple: 'rgba(167, 156, 209, 0.17)',
    teal:   'rgba(130, 196, 188, 0.17)',
    forest: 'rgba(156, 203, 164, 0.17)',
  },
  paper: {
    plum:   'rgba(155, 107, 140, 0.12)',
    purple: 'rgba(126, 114, 168, 0.12)',
    teal:   'rgba(79, 155, 147, 0.12)',
    forest: 'rgba(111, 163, 119, 0.12)',
  },
}

// seed から見た目のばらつきを作る簡易な擬似乱数（-1〜1）
function wobble(seed: number, salt: number) {
  const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

export default function SectionAmbience({
  tone, seed = 0, accent,
}: { tone: Tone; seed?: number; accent?: Accent }) {
  const c = {
    ...PALETTE[tone],
    glow: (accent && ACCENT_GLOW[tone][accent]) || PALETTE[tone].glow,
  }
  const rich = tone !== 'paper' // 濃色セクションのみ、チップ・カード・2本目のラインを追加
  const fromRight = seed % 2 === 0
  const { ref, inView } = useInView<HTMLDivElement>()

  const glowPos  = 6 + Math.abs(wobble(seed, 1)) * 30
  const glowTop  = -8 + wobble(seed, 2) * 22
  const glowDur  = 22 + (seed % 5) * 3

  const lineLeft = 12 + Math.abs(wobble(seed, 3)) * 62
  const lineTop  = 18 + Math.abs(wobble(seed, 4)) * 52
  const lineLen  = 108 + (seed % 4) * 16
  const angle    = 14 + wobble(seed, 5) * 26
  const packetDur = 10 + (seed % 4) * 2

  // 2本目のライン（濃色セクションのみ）
  const line2Left = 55 + Math.abs(wobble(seed, 6)) * 34
  const line2Top  = 55 + Math.abs(wobble(seed, 7)) * 34
  const line2Len  = 80 + (seed % 3) * 14
  const angle2    = -18 + wobble(seed, 8) * 20
  const packet2Dur = 9 + (seed % 3) * 2

  return (
    <div ref={ref} className={`sec-amb-in ${inView ? 'is-in' : ''}`}>
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

        {rich && (
          <>
            {/* 2本目のデータライン */}
            <span
              className="sec-line-parallax sec-amb-back"
              data-parallax
              style={{ left: `${line2Left}%`, top: `${line2Top}%` }}
            >
              <span
                className="sec-line-wrap"
                style={{
                  width: `${line2Len}px`,
                  transform: `rotate(${angle2}deg)`,
                  ['--line-len' as string]: `${line2Len}px`,
                }}
              >
                <span className="sec-line" style={{ background: c.line }} />
                <span className="sec-node" style={{ left: -2, background: c.node }} />
                <span className="sec-node"
                  style={{ left: line2Len - 3, background: c.node, animationDelay: '1.1s' }} />
                <span className="sec-packet"
                  style={{ background: c.node, animationDuration: `${packet2Dur}s`, animationDelay: '1.6s' }} />
              </span>
            </span>
          </>
        )}
      </div>
    </div>
  )
}
