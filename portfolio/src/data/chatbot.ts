// =============================================================
// ご相談案内（選択式チャットボット）のデータ定義
//
// 自由入力のAIチャットではなく、あらかじめ用意した質問・回答を
// たどる分岐式の案内です。新しい質問を追加する場合は、
// CHAT_NODES に1件オブジェクトを追加するだけで反映されます
// （ChatWidget.tsx 側の表示ロジックは書き換え不要）。
// =============================================================

/** 回答本文の1ブロック。段落 / 箇条書き / 手順（番号+短い説明）の3種類 */
export type ChatBodyBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'steps'; items: { title: string; text: string }[] }

/** ボタン1つの遷移先。他ノードへ移動 / サイト内アンカー / 予約ページ(新規タブ) */
export type ChatAction =
  | { kind: 'scroll'; href: string }
  | { kind: 'booking' }

export interface ChatButton {
  label: string
  /** 指定時：他のノードへ遷移する */
  targetId?: string
  /** 指定時：ノード遷移ではなくリンク動作を行う */
  action?: ChatAction
}

export interface ChatNode {
  id: string
  /** 内部管理用の短い名前（見出し表示にも利用） */
  title: string
  heading: string
  body?: ChatBodyBlock[]
  /** このノード自体が選択式メニューの場合の選択肢 */
  options?: ChatButton[]
  /** 回答の下に表示する関連ボタン */
  related?: ChatButton[]
  /**
   * このノード自体が自由入力フォームの場合に指定する。
   * AIチャットではなく、キーワードによる簡易一致判定のみを行う。
   */
  freeInput?: { placeholder: string; buttonLabel: string }
}

/** 最初のメニューへ戻るボタン（各ノードの related 末尾で使い回す） */
export const HOME_BUTTON: ChatButton = { label: '最初のメニューに戻る', targetId: 'root' }

/**
 * 回答ノード共通のフッター導線。無料相談は最初のメニューには置かず、
 * 各回答を読んだ後にだけ案内する（回答本文の直後・HOME_BUTTONの前に追加する）。
 */
export const CONSULT_FOOTER: ChatButton[] = [
  { label: '無料相談について見る', targetId: 'freeConsult' },
  HOME_BUTTON,
]

/** 最初の画面：冒頭文 */
export const GREETING = [
  'こんにちは。福原AI研究所のご相談窓口です。',
  'ご検討中の内容に近いものをお選びください。',
]

/** 最初の画面：4つの選択肢（無料相談は各回答の下から案内するため、ここには置かない） */
export const ROOT_OPTIONS: ChatButton[] = [
  { label: 'どんな相談ができますか？', targetId: 'services' },
  { label: '費用と納期の目安を知りたい', targetId: 'cost' },
  { label: '依頼から完成までの流れを知りたい', targetId: 'flow' },
  { label: '自分の業務も効率化できるか知りたい', targetId: 'efficiency' },
]

/**
 * 「当てはまる項目がない」の自由入力から、最初の4つの相談項目
 * （ROOT_OPTIONSのtargetId）の中で最も近いものを判定する。
 *
 * 自由入力AIではなく、キーワードの一致数だけで近似判定する簡易ロジック。
 * 該当キーワードが1つも無い場合は「どんな相談ができますか？」を既定値にする。
 */
const TOPIC_KEYWORDS: Record<string, string[]> = {
  services: ['相談したい', '作れる', 'できること', 'どんなこと', '依頼したい', 'ツールを作り'],
  cost: ['費用', '料金', '価格', '見積', '予算', '納期', '期間はどのくらい', 'いくら'],
  flow: ['流れ', '進め方', '手順', 'どうやって', 'プロセス', 'ステップ', '完成まで', 'どのくらいかかる'],
  efficiency: [
    '効率化', '自動化', 'excel', 'エクセル', '集計', '転記', '紙', '口頭',
    '手作業', 'ミス', '漏れ', '業務改善', 'ai', 'エーアイ', '確認', '伝達', '入力',
  ],
}

const TOPIC_REASONS: Record<string, string> = {
  services: '制作できる内容やご相談の進め方について、幅広くご案内できます。',
  cost: '費用や納期の目安についてご案内できます。',
  flow: 'ご相談から完成までの進め方についてご案内できます。',
  efficiency: 'Excel作業の自動化や業務効率化についてご案内できます。',
}

export function matchConsultTopic(rawInput: string): { targetId: string; reason: string } {
  const text = rawInput.toLowerCase()
  let bestId = 'services'
  let bestScore = 0

  for (const [targetId, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const score = keywords.reduce((n, kw) => n + (text.includes(kw.toLowerCase()) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      bestId = targetId
    }
  }

  return { targetId: bestId, reason: TOPIC_REASONS[bestId] }
}

export const CHAT_NODES: Record<string, ChatNode> = {
  services: {
    id: 'services',
    title: 'どんな相談ができますか？',
    heading: 'ご相談いただける内容',
    body: [
      { type: 'p', text: '業務の整理から、小規模なWebツールの開発・公開までご相談いただけます。' },
      { type: 'p', text: 'たとえば、次のような内容に対応しています。' },
      {
        type: 'ul',
        items: [
          'Excelやスプレッドシートで行っている集計の効率化',
          '紙や口頭で管理している情報のデジタル化',
          '顧客、案件、タスクなどを管理する社内ツール',
          '確認漏れや伝達漏れを防ぐ管理の仕組み',
          'AIを活用した文章作成や情報整理の仕組み',
          '現在の業務フローを整理し、改善方法を検討するご相談',
        ],
      },
      { type: 'p', text: 'まだ仕様や必要な機能が決まっていない段階でも問題ありません。' },
      { type: 'p', text: '現在の業務やお困りごとを伺い、必要な機能を一緒に整理します。' },
    ],
    related: [
      { label: '具体的な制作例を知りたい', targetId: 'worksExample' },
      { label: '自分の業務も相談できるか確認する', targetId: 'efficiency' },
      ...CONSULT_FOOTER,
    ],
  },

  worksExample: {
    id: 'worksExample',
    title: '制作例',
    heading: '制作例',
    body: [
      {
        type: 'p',
        text: '介護現場で行われている紙や口頭による申し送りを整理し、記録、確認、対応状況を一覧で管理できるWebツールを制作しています。',
      },
      {
        type: 'p',
        text: '利用者ごとの申し送り内容、優先度、勤務シフト、確認状況などを管理でき、伝達漏れや確認漏れを防ぐことを目的としています。',
      },
      {
        type: 'p',
        text: '同じように、現在Excel、紙、口頭などで管理している業務も、内容に合わせた小規模なWebツールへ整理できる可能性があります。',
      },
    ],
    related: [
      { label: '制作実績を見る', action: { kind: 'scroll', href: '#works' } },
      ...CONSULT_FOOTER,
    ],
  },

  cost: {
    id: 'cost',
    title: '費用と納期の目安を知りたい',
    heading: '費用と納期について',
    body: [
      { type: 'p', text: '費用と期間は、必要な機能、画面数、対応範囲によって異なります。' },
      {
        type: 'p',
        text: '小規模な試作や業務整理から始めることもできるため、最初から大規模なシステムを依頼する必要はありません。',
      },
      { type: 'p', text: 'ご相談時に、主に以下の内容を確認します。' },
      {
        type: 'ul',
        items: [
          '現在どのような業務を行っているか',
          '何に時間や手間がかかっているか',
          'どのような状態を実現したいか',
          '必要になりそうな機能',
          '希望する時期',
          '想定しているご予算',
        ],
      },
      { type: 'p', text: '確認後、対応範囲、納期、お見積もりをご案内します。' },
      { type: 'p', text: 'ご予算が決まっている場合は、その範囲で実現できる方法も検討します。' },
    ],
    related: [
      { label: '依頼から完成までの流れを見る', targetId: 'flow' },
      ...CONSULT_FOOTER,
    ],
  },

  flow: {
    id: 'flow',
    title: '依頼から完成までの流れを知りたい',
    heading: 'ご相談から完成までの流れ',
    body: [
      { type: 'p', text: '基本的には、次の流れで進めます。' },
      {
        type: 'steps',
        items: [
          { title: '1. 無料相談', text: '現在の業務やお困りごとを確認します。' },
          { title: '2. 要件整理', text: '誰が、どの場面で、何のために使うのかを整理します。' },
          { title: '3. ご提案・お見積もり', text: '必要な機能、対応範囲、納期、費用をご案内します。' },
          { title: '4. 設計・開発', text: '実際の運用を想定して制作します。' },
          { title: '5. 確認・改善', text: '操作していただき、必要に応じて調整します。' },
          { title: '6. 納品・公開', text: '完成したツールの納品や、Web上で利用できる状態への公開を行います。' },
        ],
      },
      { type: 'p', text: '仕様が決まっていない状態からでもご相談いただけます。' },
    ],
    related: [
      { label: 'どんな相談ができるか見る', targetId: 'services' },
      ...CONSULT_FOOTER,
    ],
  },

  efficiency: {
    id: 'efficiency',
    title: '自分の業務も効率化できるか知りたい',
    heading: '現在のお悩みに近いものを選んでください',
    options: [
      { label: '転記や集計に時間がかかる', targetId: 'concern-transcription' },
      { label: '情報が紙、Excel、口頭に分散している', targetId: 'concern-scattered' },
      { label: '顧客や案件の進捗を管理しづらい', targetId: 'concern-pipeline' },
      { label: '確認漏れや伝達漏れが起きている', targetId: 'concern-miss' },
      { label: 'AIを使いたいが、活用方法が分からない', targetId: 'concern-ai' },
      { label: '当てはまる項目がない', targetId: 'concern-none' },
    ],
    related: [HOME_BUTTON],
  },

  'concern-transcription': {
    id: 'concern-transcription',
    title: '転記や集計に時間がかかる',
    heading: '転記や集計に時間がかかる',
    body: [
      {
        type: 'p',
        text: '同じ情報を何度も入力したり、複数のファイルから数字を集めている場合は、入力や集計を自動化できる可能性があります。',
      },
      { type: 'p', text: '現在のファイルや作業手順を確認し、どの部分を自動化すると効果が大きいかを整理します。' },
    ],
    related: [
      { label: '別のお悩みを選ぶ', targetId: 'efficiency' },
      ...CONSULT_FOOTER,
    ],
  },

  'concern-scattered': {
    id: 'concern-scattered',
    title: '情報が紙、Excel、口頭に分散している',
    heading: '情報が紙、Excel、口頭に分散している',
    body: [
      { type: 'p', text: '情報を一か所で記録・検索・共有できるWebツールへ整理する方法が考えられます。' },
      {
        type: 'p',
        text: '現在の管理方法をすべて置き換えるのではなく、必要な部分から小さくデジタル化することもできます。',
      },
    ],
    related: [
      { label: '別のお悩みを選ぶ', targetId: 'efficiency' },
      ...CONSULT_FOOTER,
    ],
  },

  'concern-pipeline': {
    id: 'concern-pipeline',
    title: '顧客や案件の進捗を管理しづらい',
    heading: '顧客や案件の進捗を管理しづらい',
    body: [
      {
        type: 'p',
        text: '顧客情報、案件の状況、担当者、期限などを一覧で確認できる管理画面を作る方法が考えられます。',
      },
      { type: 'p', text: '業務に必要な項目だけを整理し、複雑すぎない管理方法をご提案します。' },
    ],
    related: [
      { label: '別のお悩みを選ぶ', targetId: 'efficiency' },
      ...CONSULT_FOOTER,
    ],
  },

  'concern-miss': {
    id: 'concern-miss',
    title: '確認漏れや伝達漏れが起きている',
    heading: '確認漏れや伝達漏れが起きている',
    body: [
      { type: 'p', text: '確認状況や対応状況を一覧で管理する仕組みが考えられます。' },
      {
        type: 'p',
        text: '実際に、介護現場での口頭・紙による申し送りを整理し、記録、確認、対応状況を管理できるWebツールを制作しています。',
      },
      {
        type: 'p',
        text: '「誰が確認したか分からない」「対応が完了したか追えない」といった問題は、業務に合わせた小規模ツールで改善できる可能性があります。',
      },
    ],
    related: [
      { label: '別のお悩みを選ぶ', targetId: 'efficiency' },
      ...CONSULT_FOOTER,
    ],
  },

  'concern-ai': {
    id: 'concern-ai',
    title: 'AIを使いたいが、活用方法が分からない',
    heading: 'AIを使いたいが、活用方法が分からない',
    body: [
      {
        type: 'p',
        text: 'AIを導入すること自体を目的にせず、現在の業務の中で、文章作成、情報整理、検索、集計など、どこに活用すると効果があるかを整理します。',
      },
      { type: 'p', text: 'AIを使わない方が適切な場合も含めて、実務に合った方法を検討します。' },
    ],
    related: [
      { label: '別のお悩みを選ぶ', targetId: 'efficiency' },
      ...CONSULT_FOOTER,
    ],
  },

  'concern-none': {
    id: 'concern-none',
    title: '当てはまる項目がない',
    heading: '当てはまる項目がない',
    body: [
      {
        type: 'p',
        text: '一覧にない内容でもご相談いただけます。現在の業務やお困りごとを簡単にご記入ください。入力内容に近いご相談内容をご案内します。',
      },
    ],
    freeInput: {
      placeholder: '例：Excelで毎月集計しています',
      buttonLabel: '判定する',
    },
  },

  freeConsult: {
    id: 'freeConsult',
    title: '無料相談について知りたい',
    heading: '無料相談について',
    body: [
      {
        type: 'p',
        text: '無料相談では、現在の業務やお困りごとを伺い、どのような改善方法が考えられるかを整理します。',
      },
      {
        type: 'p',
        text: 'まだ正式に依頼するか決めていない場合や、作りたいものが明確でない段階でも問題ありません。',
      },
      { type: 'p', text: '顔出しなしでもご参加いただけます。無理な勧誘は行いません。' },
    ],
    // この画面のみ、下に表示するのは予約ボタン1つだけにする
    // （「戻る」はヘッダーの戻るボタンで対応済み）
    related: [
      { label: '無料相談の日程を確認する', action: { kind: 'booking' } },
    ],
  },
}
