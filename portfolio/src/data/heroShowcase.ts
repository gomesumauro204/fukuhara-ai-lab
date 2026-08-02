// =============================================================
// ヒーロー背景：斜めに流れる「業務画面」ショーケース
// =============================================================
// public/hero-showcase/ に同名のファイルを置くと、そのカードだけ
// 自動的に実画像へ差し替わります（HeroShowcaseCard 内で
// useImageExists により画像の有無を判定）。
// 画像が無いカードは、種類（kind）に応じたCSSだけの簡易モック画面
// （仮素材）を表示します。仮素材は最終成果物ではありません。
//
// 差し替え手順：
//   1. public/hero-showcase/ フォルダを作成
//   2. 下記 id と同名のファイル（例: dashboard-kpi.webp）を配置
//   3. 自動的にモック表示から実画像表示に切り替わります
//
// 枚数や種類を増減したい場合は、この配列に追加・削除するだけで
// 反映されます（列への振り分けはコンポーネント側で自動計算）。
// =============================================================

export type ShowcaseKind =
  | 'dashboard'  // ダッシュボード（KPI・グラフ）
  | 'form'       // 入力フォーム
  | 'table'      // 一覧・検索
  | 'progress'   // 進捗管理
  | 'notify'     // 通知・アラート
  | 'calendar'   // スケジュール
  | 'flow'       // 業務フロー
  | 'sync'       // データ連携・自動処理

export interface ShowcaseItem {
  /** public/hero-showcase/{id}.webp を配置すると自動的に実画像へ差し替わる */
  id: string
  alt: string
  kind: ShowcaseKind
}

export const HERO_SHOWCASE: readonly ShowcaseItem[] = [
  { id: 'dashboard-kpi',       alt: '業務ダッシュボード画面（KPI・グラフ）', kind: 'dashboard' },
  { id: 'input-form',          alt: '入力フォーム画面',                     kind: 'form' },
  { id: 'record-list',         alt: '記録一覧・検索画面',                   kind: 'table' },
  { id: 'progress-tracker',    alt: '案件進捗管理画面',                     kind: 'progress' },
  { id: 'notification-panel',  alt: '通知・アラート画面',                   kind: 'notify' },
  { id: 'schedule-calendar',   alt: 'スケジュール管理画面',                 kind: 'calendar' },
  { id: 'workflow-diagram',    alt: '業務フロー整理画面',                   kind: 'flow' },
  { id: 'data-sync',           alt: 'データ連携・自動処理画面',             kind: 'sync' },
  { id: 'report-summary',      alt: 'レポート・集計画面',                   kind: 'dashboard' },
] as const
