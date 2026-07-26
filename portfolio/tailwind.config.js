/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 濃色：青みの強い深いネイビー
        navy: {
          DEFAULT: '#0B1B3A',
          lift:    '#0F2450', // 光を受ける面・パネル
          deep:    '#071229', // 最暗（Contact / Footer）
        },
        // アクセント：落ち着いたゴールド（面には使わない）
        // deep は淡色地で使う濃いゴールド。
        // 明るいゴールドはオフホワイト上でコントラストが取れないため。
        gold: {
          DEFAULT: '#C9A961',
          bright:  '#E0CB96',
          deep:    '#7A5F26',
        },
        // 淡色セクション
        paper: {
          DEFAULT: '#F5F2EA',
          dim:     '#E9E4D8',
        },
        // 淡色地の文字（soft も AA を満たす濃さにしている）
        ink: {
          DEFAULT: '#14192A',
          mid:     '#4A5265',
          soft:    '#5C6474',
        },
      },
      fontFamily: {
        // 大見出し：端末内蔵の日本語明朝（Webフォントを読み込まない）
        mincho: [
          '"Hiragino Mincho ProN"', '"Hiragino Mincho Pro"',
          '"Yu Mincho"', '"YuMincho"', '"MS PMincho"',
          'serif',
        ],
        // 英字：ハイコントラストなセリフ（ラテン限定・軽量）
        en: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        // 本文・UI：ゴシック
        sans: ['"Hiragino Kaku Gothic ProN"', '"Hiragino Sans"', '"Noto Sans JP"', 'Meiryo', 'sans-serif'],
      },
      spacing: {
        section:   '5.5rem',
        'section-lg': '7.5rem',
      },
      maxWidth: {
        content: '78rem',
      },
      letterSpacing: {
        label: '0.32em',
      },
    },
  },
  plugins: [],
}
