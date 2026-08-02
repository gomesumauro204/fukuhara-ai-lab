// =============================================================
// ヒーロー背景：斜めに流れる「業務画面」ショーケース
// =============================================================
// public/hero-showcase/ に同名のファイル（.jpg）を置くと、その
// カードだけ自動的に実画像へ差し替わります
// （HeroShowcaseCard 内で useImageExists により画像の有無を判定）。
// 画像が無いカードは、種類（kind）に応じたCSSだけの簡易モック画面を
// フォールバック表示します。
//
// 差し替え・追加手順：
//   1. public/hero-showcase/ に {id}.jpg を配置
//      （元のPNG/高解像度版も同フォルダに残してよい。site側は
//        表示用に軽量化した .jpg のみを読み込む）
//   2. この配列に { id, alt, kind } を1件追加/変更するだけで反映
//      （列への振り分けはコンポーネント側で自動計算）
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
  /** public/hero-showcase/{id}.jpg を配置すると自動的に実画像へ差し替わる */
  id: string
  alt: string
  kind: ShowcaseKind
}

export const HERO_SHOWCASE: readonly ShowcaseItem[] = [
  { id: '01-operations-overview',  alt: '業務ダッシュボード画面（KPI・グラフ）', kind: 'dashboard' },
  { id: '02-customers-projects',   alt: '顧客・案件管理画面',                   kind: 'table' },
  { id: '03-task-operations',      alt: 'タスク進捗管理画面（かんばん）',       kind: 'progress' },
  { id: '04-approval-management',  alt: '承認・申請管理画面',                   kind: 'notify' },
  { id: '05-automation-flows',     alt: '業務自動化フロー画面',                 kind: 'flow' },
] as const
