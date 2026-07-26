// =============================================================
// 制作実績データ
// =============================================================
// 新しい実績を追加する場合は、この配列に1件追加するだけで
// カードが増えます。images に指定したファイルを public/ に置くと
// 自動で表示され、無い場合は上品なプレースホルダー表示になります
// （ワイヤーフレーム風のダミー画面は使いません）。
// =============================================================

export interface Work {
  /** 一覧・見出しに出すツール名 */
  title: string
  /** 位置づけを正確に示すラベル（例：自主開発／デモ公開中） */
  badge: string
  /** 対象業務（例：介護施設の申し送り業務） */
  target: string
  /** 何を題材にしたか（1〜2文） */
  summary: string
  /** 解決する課題 */
  problem: string
  /** どう解決したか */
  solution: string
  /** 主な機能 */
  features: readonly { name: string; note: string }[]
  /** 担当した範囲 */
  scope: readonly string[]
  /** 使用技術 */
  stack: readonly string[]
  /** 公開URL（空文字なら準備中扱い） */
  demoUrl: string
  /** スクリーンショット（public/ 配下のパス。未配置なら自動でプレースホルダー表示） */
  images: {
    pc: string
    sp: string
  }
}

export const WORKS: readonly Work[] = [
  {
    title: '介護現場向け 申し送り管理ツール',
    badge: '自主開発／デモ公開中',
    target: '介護施設の申し送り業務',
    summary:
      '介護現場の申し送り業務を題材に、実務運用を想定して設計・開発したデモツールです。',
    problem:
      '紙や口頭を中心とした申し送りでは、情報の確認漏れや見落としが発生しやすい。誰が何を伝えたかが残らず、シフトをまたぐと経緯が追えなくなる。',
    solution:
      '記録・検索・状態管理をひとつの画面にまとめ、重要度を明示できる形へ整理。スマートフォンからも同じ内容を確認できるようにし、口頭と紙に依存しない伝達を可能にした。',
    features: [
      { name: '申し送りの登録', note: '利用者・日付・内容を記録' },
      { name: '一覧表示',       note: '時系列で全件を確認' },
      { name: '重要フラグ',     note: '見落とせない項目を明示' },
      { name: 'キーワード検索', note: '過去の記録を素早く参照' },
      { name: 'ステータス管理', note: '未対応・対応済を切替' },
      { name: 'スマホ対応',     note: '移動中・現場でも確認' },
    ],
    scope: ['課題整理', '要件整理', 'UI設計', '開発', 'テスト', 'Vercel公開'],
    stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Vercel'],
    demoUrl: 'https://kaigo-handover.vercel.app/',
    images: {
      pc: '/works-kaigo-pc.png',
      sp: '/works-kaigo-sp.png',
    },
  },

  // ---- 新しい実績はここに追加 ----
]
