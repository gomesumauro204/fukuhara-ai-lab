# 福原AI研究所 / FUKUHARA AI LAB

業務整理・Webツール開発・業務改善支援を行うコーポレートサイトです。

企業担当者・個人事業主に対し、支援内容・制作実績・相談方法を1ページで伝えることを目的としています。

---

## 技術構成

| 項目 | 内容 |
|---|---|
| フレームワーク | React 18 + TypeScript |
| ビルド | Vite 5 |
| スタイル | Tailwind CSS 3 |
| ホスティング | Vercel |
| 追加ライブラリ | なし（アニメーションはCSS + IntersectionObserver） |

---

## ローカル起動

```bash
cd portfolio
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

**本番ビルドの確認**

```bash
npm run build && npm run preview
```

---

## ページ構成

```
01  ヘッダー（固定）
02  ファーストビュー
03  顧客が抱えやすい課題      #problem
04  支援内容                  #service
05  制作実績                  #works
06  福原AI研究所の特徴        #features
07  制作・相談の流れ          #process
08  プロフィール              #about
09  よくある質問              #faq
10  無料相談・お問い合わせ    #contact
11  フッター
＋  選択式チャット（右下固定）
```

---

## 設定の変更方法

サイトの文言・リンクは **`src/data/site.ts`** に集約しています。

| 変更したいもの | 編集する場所 |
|---|---|
| サイト名・英語名・キャッチコピー | `SITE` |
| 公開URL | `SITE.url` |
| メールアドレス | `CONTACT`（1箇所の変更で全リンクに反映） |
| 無料相談の予約URL | `BOOKING.url`（1箇所の変更で全予約導線に反映） |
| 選択式チャットの表示/非表示 | `FEATURES.chatWidget`（`true` / `false`） |
| ナビゲーション項目 | `NAV` |
| 課題リスト | `PROBLEMS` |
| 支援内容 | `SERVICES` |
| 特徴 | `FEATURES_LIST` |
| 制作の流れ | `PROCESS` |
| よくある質問 | `FAQS` |
| プロフィール本文 | `PROFILE` |

---

## 制作実績の追加方法

**`src/data/works.ts`** の `WORKS` 配列に1件追加するだけでカードが増えます。

```ts
{
  title: '物件管理サポートツール',
  badge: '自主開発／デモ公開中',
  summary: '不動産業の物件情報管理を題材に制作したデモツールです。',
  problem: '物件情報や対応状況の管理が分散し、確認に時間がかかる。',
  solution: '一覧表示、対応状況の管理、検索機能を備えたWebツールとして整理。',
  features: ['物件情報の登録', '一覧表示', 'ステータス管理'],
  scope: ['課題整理', '要件整理', 'UI設計', '開発'],
  demoUrl: 'https://example.vercel.app/',   // 未公開なら ''
  images: {
    pc: '/works-bukken-pc.png',
    sp: '/works-bukken-sp.png',
  },
}
```

- `demoUrl` が空の場合は「準備中」と表示され、ボタンは無効になります
- `images` に指定した画像が `public/` にあれば自動表示され、無い場合はワイヤーフレーム表示になります

---

## よくある質問（FAQ）の追加方法

**`src/data/site.ts`** の `FAQS` 配列に追記します。

```ts
{
  q: '納期はどのくらいかかりますか？',
  a: '内容によりますが、小規模なツールであれば2〜4週間程度が目安です。',
}
```

---

## 画像素材

`public/` に以下のファイル名で配置すると自動で反映されます。
**未配置でもレイアウトは崩れません**（ワイヤーフレーム表示になります）。

| ファイル名 | 推奨サイズ | 用途 |
|---|---|---|
| `works-kaigo-pc.png` | 1600×1000 | 介護ツールのPC画面 |
| `works-kaigo-sp.png` | 750×1334 | 介護ツールのスマホ画面 |
| `og-image.png` | 1200×630 | SNSシェア画像 |
| `apple-touch-icon.png` | 180×180 | iOSホーム画面アイコン |

スクリーンショットは実際のツール画面を撮影したものを使用してください。

---

## Vercel公開手順

### 初回設定

1. [Vercel](https://vercel.com/new) にログイン
2. GitHubリポジトリを選択
3. **Root Directory** に `portfolio` を指定
4. Framework Preset: `Vite`
5. 「Deploy」

### 2回目以降

`main` ブランチへpushすると自動でデプロイされます。

### プロジェクト名・URLを変更する場合

Vercel管理画面 → Settings → General → Project Name

変更すると旧URLは無効になり、自動リダイレクトはされません。
変更後は以下も更新してください。

- `src/data/site.ts` の `SITE.url`
- `index.html` の canonical / OGP のURL
- `public/robots.txt` と `public/sitemap.xml`
- クラウドワークス等に登録済みのURL

---

## SEO・アクセシビリティ

- title / meta description / canonical / OGP / Twitter Card 設定済み
- favicon（SVG）・404ページあり
- `robots.txt` / `sitemap.xml` あり
- 見出し階層（h1 → h2 → h3）を適切に設定
- キーボード操作・フォーカス表示に対応
- `prefers-reduced-motion` でアニメーションを停止
- 外部リンクに `rel="noopener noreferrer"` を設定
