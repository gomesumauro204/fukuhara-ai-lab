/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // メイン：濃いネイビー
        navy: {
          DEFAULT: '#12233f',
          light:   '#1c3559',
          dark:    '#0b1729',
        },
        // アクセント：落ち着いた青緑
        accent: {
          DEFAULT: '#0f7490',
          light:   '#e6f3f6',
        },
        // 本文：黒に近い濃いグレー
        ink: {
          DEFAULT: '#1f2733',
          mid:     '#4a5563',
          light:   '#6b7684',
        },
        // 補助背景：薄いグレー / オフホワイト
        surface: {
          DEFAULT: '#ffffff',
          soft:    '#f7f8fa',
          line:    '#e4e7ec',
        },
      },
      fontFamily: {
        sans: [
          'Hiragino Kaku Gothic ProN',
          'Hiragino Sans',
          'Noto Sans JP',
          'Meiryo',
          'sans-serif',
        ],
      },
      fontSize: {
        // 本文を読みやすいサイズに固定
        body: ['0.9375rem', { lineHeight: '1.9' }],
        'body-lg': ['1rem', { lineHeight: '1.9' }],
      },
      spacing: {
        // セクション余白（旧py-32=8remから約30%削減）
        section: '5.5rem',
        'section-lg': '7rem',
      },
      maxWidth: {
        content: '75rem',
      },
    },
  },
  plugins: [],
}
