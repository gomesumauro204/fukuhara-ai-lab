# 福原AI研究所 / FUKUHARA AI LAB

業務整理・Webツール開発・業務改善支援を行うコーポレートサイトです。

企業担当者・個人事業主に対し、**制作実績を中心に**支援内容・相談方法を1ページで伝えることを目的としています。

---

## 技術構成

| 項目 | 内容 |
|---|---|
| フレームワーク | React 18 + TypeScript（strict） |
| ビルド | Vite 5 |
| スタイル | Tailwind CSS 3 |
| ホスティング | Vercel |
| 追加ライブラリ | なし（アニメーションは CSS + IntersectionObserver） |
| Webフォント | Cormorant Garamond（英字のみ）。日本語は端末内蔵フォント |

---

## ローカル起動

```bash
cd portfolio
npm install
npm run dev
```

**本番ビルドの確認**

```bash
npm run build && npm run preview
```

---

## ページ構成

```
      ヘッダー（固定）
      ファーストビュー          濃紺
01    制作実績（最重要）        濃紺   #works
02    課題                      淡色   #problem
03    支援内容                  濃紺   #service
04    特徴                      淡色   #strengths
05    制作の流れ                濃紺   #process
06    専門体制                  淡色   #team
07    プロフィール              濃紺   #about
08    よくある質問              淡色   #faq
      お問い合わせ              最暗   #contact
      フッター                  最暗
   +  ご相談案内（選択式・右下固定）
```

企業担当者は Hero → 制作実績 → プロフィール → お問い合わせ の順に見るため、
**制作実績を最初のセクション**に置いています。

---

## ファイル構成

```
src/
  data/
    site.ts             サイト全体の文言・リンク・データ
    works.ts            制作実績データ
  hooks/
    useHeroMotion.ts       Hero専用の視差（マウス・スクロール）
    useSectionParallax.ts  全セクション共通の軽量パララックス
  components/
    ui.tsx              共通UI（Section / SectionHead / ボタン / Reveal / アイコン）
    Logo.tsx            ロゴ
    BrandIntro.tsx      初回のみの短いブランド表示
    Header.tsx          ヘッダー・スマホメニュー
    Hero.tsx            ファーストビュー
    HeroVisual.tsx      中央の「光の柱」（CSSのみ）
    HeroAmbience.tsx    Hero背景の光・データライン・粒子
    SectionAmbience.tsx Hero以外の各セクション共通の背景装飾
    ScreenFrame.tsx     スクリーンショット枠／未配置時のプレースホルダー
    Works.tsx           制作実績
    Problem.tsx         課題
    Service.tsx         支援内容
    Strengths.tsx       特徴
    Process.tsx         制作の流れ
    Team.tsx            専門体制
    Profile.tsx         プロフィール
    Faq.tsx             よくある質問
    Contact.tsx         お問い合わせ
    Footer.tsx          フッター
    ChatWidget.tsx      ご相談案内（選択式）
  App.tsx               ページ構成
  index.css             デザイントークン・アニメーション
```

---

## 設定の変更方法

文言・リンクは **`src/data/site.ts`** に集約しています。

| 変更したいもの | 編集する場所 |
|---|---|
| サイト名・英語名・キャッチコピー | `SITE` |
| ロゴのレターマーク | `SITE.mark` |
| 公開URL | `SITE.url` |
| ファーストビューの見出し・補足 | `HERO` |
| メールアドレス | `CONTACT`（1箇所の変更で全リンクに反映） |
| 無料相談の予約URL | `BOOKING.url`（1箇所の変更で全予約導線に反映） |
| ご相談案内の表示/非表示 | `FEATURES.chatWidget` |
| ブランド表示の有無 | `FEATURES.brandIntro` |
| ナビゲーション項目 | `NAV` |
| 課題リスト | `PROBLEMS` |
| 支援内容 | `SERVICES` |
| 特徴 | `STRENGTHS` |
| 制作の流れ | `PROCESS` |
| 専門体制 | `TEAM` |
| プロフィール | `PROFILE` |
| よくある質問 | `FAQS` |

ご相談案内の選択肢だけは `src/components/ChatWidget.tsx` 冒頭の `OPTIONS` にあります。

---

## 制作実績の追加方法

**`src/data/works.ts`** の `WORKS` 配列に1件追加するだけです。

```ts
{
  title: '物件管理サポートツール',
  badge: '自主開発／デモ公開中',
  target: '不動産業の物件管理業務',
  summary: '不動産業の物件情報管理を題材に制作したデモツールです。',
  problem: '物件情報や対応状況の管理が分散し、確認に時間がかかる。',
  solution: '一覧表示、対応状況の管理、検索機能を備えたWebツールとして整理。',
  features: [
    { name: '物件情報の登録', note: '住所・条件・担当者を記録' },
    { name: '一覧表示',       note: '状況ごとに絞り込み' },
  ],
  scope: ['課題整理', '要件整理', 'UI設計', '開発'],
  stack: ['React', 'TypeScript', 'Vite'],
  demoUrl: 'https://example.vercel.app/',   // 未公開なら ''
  images: {
    pc: '/works-bukken-pc.png',
    sp: '/works-bukken-sp.png',
  },
}
```

- `demoUrl` が空なら「準備中」と表示され、ボタンは無効になります
- `images` の画像が `public/` にあれば自動表示、無ければ上品なプレースホルダー（ロゴマーク＋「Screenshot Coming Soon」）を表示します。ダミーのUI線は使いません
- 実績は2件目以降、画像が左右交互になるレイアウトへ自動で切り替わります

---

## 画像素材

`public/` に以下のファイル名で置くと自動で反映されます。
**未配置でもレイアウトは崩れません。**

| ファイル名 | 推奨サイズ | 用途 |
|---|---|---|
| `works-kaigo-pc.png` | 1600×1000 | 介護ツールのPC画面 |
| `works-kaigo-sp.png` | 750×1334 | 介護ツールのスマホ画面 |
| `og-image.png` | 1200×630 | SNSシェア画像 |
| `apple-touch-icon.png` | 180×180 | iOSホーム画面アイコン |

スクリーンショットは実際のツール画面を撮影したものを使用してください。

---

## デザイン方針

| 項目 | 内容 |
|---|---|
| 背景 | 濃紺 `#0B1B3A` / 最暗 `#071229` / オフホワイト `#F5F2EA` |
| アクセント | ゴールド `#C9A961`（淡色地では `#7A5F26`）。罫線・番号・矢印のみ |
| 見出し | 端末内蔵の日本語明朝（ウェイト500） |
| 英字 | Cormorant Garamond。広い字間の極小ラベルとして使用 |
| 構図 | 中央の縦長ビジュアルを軸に、巨大見出しがその前を横断 |
| 絵文字 | 使用しない（すべてSVGアイコン） |

**アニメーション方針**：`transform` と `opacity` のみを動かし、描画コストを抑えています。

- **登場**：数字 → 見出し → 説明文 → 画像 → CTA の順に 0.12s 刻みで時間差表示（`Reveal` の `delay` 1〜6）
- **左右交互**：制作実績など画像を含むブロックは `Reveal` の `dir="left" / "right"` で交互にフェードイン
- **背景の生命感**：`SectionAmbience` が全セクションに、呼吸する光とデータライン（ノード＋パケット）を配置。色味はセクションの背景色（濃紺／オフホワイト）に合わせて変化する
- **パララックス**：`useSectionParallax` が背景装飾と画像だけをスクロール速度違いで動かす。本文・見出しは動かさず可読性を優先
- スマートフォンでは粒子・データライン・画像パララックスを間引き、PCより軽くしている
- `prefers-reduced-motion` で上記すべてを停止

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
- `public/robots.txt` / `public/sitemap.xml`
- クラウドワークス等に登録済みのURL

---

## SEO・アクセシビリティ

- title / meta description / canonical / OGP / Twitter Card
- favicon（SVG）・404ページ・`robots.txt`・`sitemap.xml`
- 見出し階層 h1 → h2 → h3 → h4
- 全テキストが WCAG 2.1 AA のコントラスト比を満たす（最小 5.32:1）
- 装飾要素には `aria-hidden`、対話要素には `aria-expanded` / `aria-controls`
- キーボード操作・フォーカス表示（ゴールドのアウトライン）
- `prefers-reduced-motion` でアニメーション停止
- 外部リンクに `rel="noopener noreferrer"`
