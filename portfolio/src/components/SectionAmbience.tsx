import { useInView } from './ui'

/**
 * 各セクション共通の背景装飾（Hero以外）。
 *
 * 「AIがデータを処理し、情報がネットワーク上を流れている」ことを
 * 連想させる要素だけで構成する（星空・宇宙・ランダムな粒子にはしない）。
 *
 * 構成要素（濃色セクションでは常時3〜6個が視認できる密度にしている）
 * ・背景光（呼吸するグロー）
 * ・データライン＋ノード＋流れるパケット
 * ・AIチップ（小さな矩形＋内部のピン）
 * ・処理フローカード（半透明パネル＋内部の2本の行）
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

const PALETTE: Record<Tone, { glow: string; line: string; node: string; chip: string }> = {
  navy:  { glow: 'rgba(92, 142, 222, 0.22)', line: 'rgba(150, 190, 245, 0.28)', node: 'rgba(212, 184, 122, 0.85)', chip: 'rgba(150, 190, 245, 0.55)' },
  deep:  { glow: 'rgba(92, 142, 222, 0.19)', line: 'rgba(150, 190, 245, 0.24)', node: 'rgba(212, 184, 122, 0.75)', chip: 'rgba(150, 190, 245, 0.5)' },
  paper: { glow: 'rgba(70, 96, 150, 0.10)',  line: 'rgba(70, 90, 130, 0.16)',   node: 'rgba(122, 95, 38, 0.55)',   chip: 'rgba(70, 90, 130, 0.4)' },
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

  // AIチップの位置
  const chipLeft = 20 + Math.abs(wobble(seed, 9)) * 55
  const chipTop  = 65 + Math.abs(wobble(seed, 10)) * 25

  // 処理フローカードの位置
  const cardLeft = 62 + Math.abs(wobble(seed, 11)) * 28
  const cardTop  = 12 + Math.abs(wobble(seed, 12)) * 18

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

            {/* AIチップ */}
            <span
              className="sec-chip sec-amb-mid"
              data-parallax
              style={{ left: `${chipLeft}%`, top: `${chipTop}%`, color: c.chip, borderColor: c.chip }}
            />

            {/* 処理フローカード */}
            <span
              className="sec-card sec-amb-back"
              data-parallax
              style={{
                left: `${cardLeft}%`, top: `${cardTop}%`,
                color: c.line, borderColor: c.line,
                background: 'rgba(150,190,245,0.04)',
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}
