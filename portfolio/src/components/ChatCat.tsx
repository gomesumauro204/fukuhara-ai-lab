import { useId } from 'react'

/**
 * ご相談導線の案内役：サイトのメインキャラクターである青い猫。
 *
 * ユーザー提供の参考画像（丸く大きな頭、青い猫、光る水色の目、
 * 白い首輪、金色の鈴、丸い体型、明るく親しみやすい表情、ぷにっとした
 * 質感）を、そのまま画像として使う権利関係を確認できないため、
 * 形・頭身・表情・色味・可愛さをできる限り保ったオリジナルの
 * ベクターとして再構成している（背景ごとの転用ではない）。
 *
 * レイアウト変更に合わせ、上に置く「ご相談はこちら」ボタンを
 * 前足で指し示す（上方向へ伸ばす）ポーズにしている。
 */
export default function ChatCat() {
  const uid = useId()
  const highlightId = `catHighlight-${uid}`

  return (
    <svg className="cat" viewBox="0 0 130 140" width="100%" height="100%" aria-hidden="true">
      <defs>
        <radialGradient id={highlightId} cx="35%" cy="25%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="cat-bob">
        <g className="cat-greet">
          {/* 尻尾（体の左後ろでゆっくり揺れる） */}
          <path className="cat-tail"
            d="M28,108 C6,104 -3,80 9,62 C16,52 30,54 31,66
               C23,68 17,82 25,94 C29,101 31,105 28,108 Z" />

          {/* 体 */}
          <g className="cat-body-group">
            <ellipse className="cat-body" cx="66" cy="100" rx="37" ry="29" />

            {/* 左前足（休めた状態） */}
            <ellipse className="cat-paw" cx="40" cy="123" rx="14" ry="12" />
            <ellipse className="cat-paw-pad" cx="40" cy="119" rx="2.1" ry="2.6" />
            <ellipse className="cat-paw-pad" cx="34" cy="125" rx="1.7" ry="2.1" />
            <ellipse className="cat-paw-pad" cx="46" cy="125" rx="1.7" ry="2.1" />

            {/* 右前足（上のボタンを指すよう、上方向へ伸ばす） */}
            <g className="cat-paw-point">
              <ellipse className="cat-paw" cx="92" cy="80" rx="11.5" ry="16.5"
                transform="rotate(-18 92 80)" />
              <ellipse className="cat-paw-pad" cx="90" cy="68" rx="1.9" ry="2.3"
                transform="rotate(-18 92 80)" />
              <ellipse className="cat-paw-pad" cx="96" cy="71" rx="1.6" ry="1.9"
                transform="rotate(-18 92 80)" />
              <ellipse className="cat-paw-pad" cx="85" cy="72" rx="1.6" ry="1.9"
                transform="rotate(-18 92 80)" />
            </g>

            {/* 首輪と鈴 */}
            <path className="cat-collar" d="M42,84 Q66,97 90,84" />
            <circle className="cat-bell" cx="66" cy="93" r="6.6" />
            <line className="cat-bell-slit" x1="66" y1="90" x2="66" y2="96.5" />
            <circle className="cat-bell-hole" cx="66" cy="96.5" r="0.9" />
          </g>

          {/* 頭部（体より大きく丸い） */}
          <g>
            <path className="cat-ear" d="M36,30 L16,-6 L54,18 Z" />
            <path className="cat-ear-inner" d="M37,26 L25,2 L50,16 Z" />
            <path className="cat-ear" d="M96,30 L116,-6 L78,18 Z" />
            <path className="cat-ear-inner" d="M95,26 L107,2 L82,16 Z" />

            <circle className="cat-head" cx="66" cy="54" r="41" />

            <path className="cat-whisker" d="M24,62 L4,58" />
            <path className="cat-whisker" d="M25,68 L4,68" />
            <path className="cat-whisker" d="M108,62 L128,58" />
            <path className="cat-whisker" d="M107,68 L128,68" />

            <g className="cat-eye-group">
              <circle className="cat-eye-glow" cx="51" cy="57" r="11" />
              <ellipse className="cat-eye" cx="51" cy="57" rx="7.6" ry="10" />
            </g>
            <g className="cat-eye-group">
              <circle className="cat-eye-glow" cx="81" cy="57" r="11" />
              <ellipse className="cat-eye" cx="81" cy="57" rx="7.6" ry="10" />
            </g>

            <path className="cat-nose" d="M63,70 L66,73.5 L69,70 Z" />
            <path className="cat-mouth" d="M55,74 Q66,85 77,74 Q66,80 55,74 Z" />

            {/* 光沢のハイライト（ぷにっとした質感） */}
            <ellipse cx="46" cy="30" rx="20" ry="15" fill={`url(#${highlightId})`} />
          </g>
        </g>
      </g>
    </svg>
  )
}
