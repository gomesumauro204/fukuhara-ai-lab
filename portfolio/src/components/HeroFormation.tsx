/**
 * ファーストビューの「5秒間のオープニング」演出。
 *
 * 採用案：AIチップ（演算コア）の外郭・内部パネル・回路・ピンが
 * 段階的に組み上がり、中央のコアが一度だけ強く点灯してから
 * 静かな待機発光へ落ち着く。
 *
 *   0.0〜1.0秒　外郭が少し手前へ拡大しながら暗闇から立ち上がる
 *   0.4〜1.6秒　内部パネル（面）が浮かび上がる
 *   1.0〜2.6秒　内部の回路トレースが伸びる
 *   1.3〜3.0秒　ピン（端子）が順に現れる
 *   2.2〜3.3秒　中心のコアが点灯する
 *   3.0〜3.7秒　一度だけ明確なエネルギー反応（フラッシュリング）
 *   3.3〜5.0秒　コアが息づき、落ち着く
 *   5.0秒〜　　　弱い待機発光だけが続く（無限ループ）
 *
 * すべて transform / opacity のみ。SVGのpathLength依存を避け、
 * どのブラウザでも「最終的に完成形が表示される」ことを優先している。
 *
 * PC版：横幅と厚みを感じる「演算コア」の全体像。
 * スマホ版：PC版の縮小コピーではなく、横に長い大型装置の
 * 一部分（帯状の断面）が画面内に収まっている、という見せ方。
 * 上下をマスクでフェードさせ、画面外まで装置が続いている印象にする。
 */

const TRACES_DESKTOP = [
  { d: 'M100,40 V22', delay: 1.0 },
  { d: 'M140,40 V22', delay: 1.12 },
  { d: 'M100,180 V198', delay: 1.24 },
  { d: 'M140,180 V198', delay: 1.36 },
  { d: 'M40,90 H22', delay: 1.48 },
  { d: 'M40,130 H22', delay: 1.6 },
  { d: 'M200,90 H218', delay: 1.72 },
  { d: 'M200,130 H218', delay: 1.84 },
] as const

const PINS_DESKTOP = [
  { x: 88, y: 12, w: 16, h: 8 }, { x: 132, y: 12, w: 16, h: 8 },
  { x: 88, y: 200, w: 16, h: 8 }, { x: 132, y: 200, w: 16, h: 8 },
  { x: 8, y: 76, w: 8, h: 16 }, { x: 8, y: 124, w: 8, h: 16 },
  { x: 224, y: 76, w: 8, h: 16 }, { x: 224, y: 124, w: 8, h: 16 },
] as const

/**
 * PC版：横幅240×高さ220の「演算コア」。細長い柱ではなく、
 * 外郭＋内部パネルの2枚の面を重ねて厚みを持たせている。
 */
export function HeroFormationDesktop() {
  return (
    <div className="chip-formation-wrap">
      <svg
        className="chip-formation"
        viewBox="0 0 240 220"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* コアの光暈（発光の下敷き） */}
        <circle className="chip-core-glow" cx="120" cy="110" r="62" />

        {/* 内部パネル（面）：外郭より一拍遅れて浮かび上がり、厚みを作る */}
        <rect className="chip-panel" x="40" y="40" width="160" height="140" rx="14" />

        {/* 内部回路トレース */}
        {TRACES_DESKTOP.map((t, i) => (
          <path key={i} className="chip-trace" d={t.d} style={{ animationDelay: `${t.delay}s` }} />
        ))}

        {/* 外郭（チップ本体の輪郭） */}
        <rect className="chip-outline" x="20" y="20" width="200" height="180" rx="20" />

        {/* ピン（端子） */}
        {PINS_DESKTOP.map((p, i) => (
          <rect
            key={i}
            className="chip-pin"
            x={p.x} y={p.y} width={p.w} height={p.h} rx="2"
            style={{ animationDelay: `${1.3 + i * 0.16}s` }}
          />
        ))}

        {/* コア */}
        <rect className="chip-core" x="94" y="84" width="52" height="52" rx="12" />

        {/* 完成時に一度だけ広がって消えるエネルギーリング */}
        <rect className="chip-core-flash" x="94" y="84" width="52" height="52" rx="12" />
      </svg>
    </div>
  )
}

const PINS_MOBILE_TOP = [40, 110, 180, 250, 300] as const
const PINS_MOBILE_BOTTOM = [40, 110, 180, 250, 300] as const

/**
 * スマホ版：横320×高さ90の「帯状の断面」。左右は viewBox の外へ
 * 意図的にはみ出させ（SVGの既定クリップで自然に切れる）、
 * 上下は index.css 側の mask-image でフェードさせることで、
 * 「大型装置の一部分だけが画面に収まっている」印象を作る。
 * PC版の縮小コピーではなく、パーツ構成そのものが別（帯状・非対称）。
 */
export function HeroFormationMobile() {
  return (
    <div className="chip-formation-wrap chip-formation-wrap-sm">
      <svg
        className="chip-formation chip-formation-sm"
        viewBox="0 0 320 90"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <circle className="chip-core-glow" cx="160" cy="45" r="34" />

        <rect className="chip-panel" x="-40" y="20" width="400" height="50" rx="16" />

        <path className="chip-trace" d="M160,26 V16" style={{ animationDelay: '1.0s' }} />
        <path className="chip-trace" d="M160,64 V74" style={{ animationDelay: '1.15s' }} />
        <path className="chip-trace" d="M120,45 H100" style={{ animationDelay: '1.3s' }} />
        <path className="chip-trace" d="M200,45 H220" style={{ animationDelay: '1.45s' }} />

        <rect className="chip-outline" x="-60" y="8" width="440" height="74" rx="24" />

        {PINS_MOBILE_TOP.map((x, i) => (
          <rect key={`t${i}`} className="chip-pin" x={x} y="0" width="16" height="7" rx="2"
            style={{ animationDelay: `${1.3 + i * 0.14}s` }} />
        ))}
        {PINS_MOBILE_BOTTOM.map((x, i) => (
          <rect key={`b${i}`} className="chip-pin" x={x} y="83" width="16" height="7" rx="2"
            style={{ animationDelay: `${1.4 + i * 0.14}s` }} />
        ))}

        <rect className="chip-core" x="140" y="27" width="40" height="36" rx="10" />
        <rect className="chip-core-flash" x="140" y="27" width="40" height="36" rx="10" />
      </svg>
    </div>
  )
}
