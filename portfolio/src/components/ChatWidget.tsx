import { useEffect, useRef, useState } from 'react'
import { SITE, BOOKING, CONTACT } from '../data/site'
import { WORKS } from '../data/works'

// =============================================================
// ご相談案内（選択式）
//
// AI APIは使用しません。あらかじめ定義した選択肢のみを提示します。
// 表示 / 非表示は data/site.ts の FEATURES.chatWidget で切り替え。
// 文言や選択肢を変更する場合は下の OPTIONS を編集してください。
// =============================================================

type Action =
  | { kind: 'scroll'; href: string; reply: string }  // セクションへ移動
  | { kind: 'link';   url: string;  reply: string }  // 外部ページ / メール

interface Option {
  label: string
  action: Action
}

const OPTIONS: Option[] = [
  {
    label: '制作できるものを知りたい',
    action: {
      kind: 'scroll',
      href: '#service',
      reply: '入力フォーム、記録・管理画面、検索、集計などの小規模Webツールを設計・開発しています。支援内容をご覧ください。',
    },
  },
  {
    label: '依頼の流れを知りたい',
    action: {
      kind: 'scroll',
      href: '#process',
      reply: '無料相談 → 課題・要件の整理 → ご提案・お見積もり → 試作・開発 → 確認・改善・納品の順で進めます。',
    },
  },
  {
    label: '介護申し送りツールを見る',
    action: {
      kind: 'link',
      url: WORKS[0].demoUrl,
      reply: '自主開発のデモツールを別のタブで開きます。',
    },
  },
  {
    label: '無料相談を予約したい',
    action: {
      kind: 'link',
      url: BOOKING.url,
      reply: '予約ページを別のタブで開きます。オンライン30分・無料です。',
    },
  },
  {
    label: 'メールで問い合わせる',
    action: {
      kind: 'link',
      url: CONTACT.mailto,
      reply: `メールでのご相談も承ります（${CONTACT.email}）。`,
    },
  },
]

const GREETING = [
  `こんにちは。${SITE.name}のご相談窓口です。`,
  'ご用件を下からお選びください。',
]

export default function ChatWidget() {
  const [open, setOpen]   = useState(false)
  const [reply, setReply] = useState<string | null>(null)

  const panelRef  = useRef<HTMLDivElement>(null)
  const launchRef = useRef<HTMLButtonElement>(null)

  // Escape で閉じる
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // 開いたらパネル内の最初のボタンへフォーカスを移す
  useEffect(() => {
    if (open) panelRef.current?.querySelector('button')?.focus()
  }, [open])

  function closePanel() {
    setOpen(false)
    launchRef.current?.focus()
  }

  function handleSelect({ action }: Option) {
    setReply(action.reply)

    if (action.kind === 'scroll') {
      setOpen(false)
      // ブラウザ標準のアンカー遷移で移動する
      window.location.hash = action.href
    } else if (action.url.startsWith('mailto:')) {
      window.location.href = action.url
    } else {
      window.open(action.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <>
      {/* ── 起動：PC は右端の縦書きティーザー ── */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-controls="chat-panel"
          className="chat-teaser hidden lg:flex flex-col items-center gap-3
            border-y border-l border-gold/40 bg-navy-lift/90 backdrop-blur-sm
            rounded-l-md px-3 py-6 text-gold
            hover:bg-navy-lift hover:border-gold/70 transition-colors"
        >
          <span className="w-1 h-1 rounded-full bg-gold" aria-hidden="true" />
          <span className="text-[12px] font-semibold tracking-[0.28em]"
            style={{ writingMode: 'vertical-rl' }}>
            ご相談案内
          </span>
        </button>
      )}

      {/* ── 起動：スマホは右下のコンパクトなタブ ── */}
      {!open && (
        <button
          ref={launchRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-controls="chat-panel"
          className="chat-launcher-sp lg:hidden inline-flex items-center gap-2.5
            rounded-full border border-gold/50 bg-navy-lift/95 backdrop-blur-sm
            px-4 py-3 text-[12.5px] font-semibold text-gold shadow-lg"
        >
          <span className="w-1 h-1 rounded-full bg-gold" aria-hidden="true" />
          ご相談案内
        </button>
      )}

      {/* ── パネル ── */}
      {open && (
        <div
          id="chat-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="ご相談案内"
          className="chat-panel flex flex-col overflow-hidden rounded-xl
            border border-gold/35 bg-navy-lift shadow-2xl"
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between gap-3
            px-4 py-3.5 border-b border-white/10">
            <span className="flex items-center gap-2.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0"
                aria-hidden="true" />
              <span className="text-[13px] font-semibold text-white">
                ご相談案内
              </span>
            </span>

            <span className="flex items-center gap-3 shrink-0">
              {reply && (
                <button type="button" onClick={() => setReply(null)}
                  className="text-[11.5px] text-white/45 hover:text-white
                    transition-colors">
                  最初に戻る
                </button>
              )}
              <button type="button" onClick={closePanel} aria-label="閉じる"
                className="p-0.5 text-white/50 hover:text-white transition-colors">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                  aria-hidden="true">
                  <path d="M4 4l7 7M11 4l-7 7" stroke="currentColor"
                    strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          </div>

          {/* 本文 */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {GREETING.map(line => (
              <p key={line}
                className="border-l-2 border-gold/60 pl-3 mb-3
                  text-[12.5px] leading-[1.85] text-white/75">
                {line}
              </p>
            ))}

            {/* 選択に対する案内文 */}
            {reply && (
              <p className="mt-4 mb-4 rounded-md bg-gold/10 border border-gold/25
                px-3.5 py-3 text-[12.5px] leading-[1.85] text-gold-bright">
                {reply}
              </p>
            )}

            <ul className="mt-4 space-y-2">
              {OPTIONS.map(option => (
                <li key={option.label}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="group w-full flex items-center gap-2.5
                      rounded-md border border-white/15 px-3.5 py-2.5
                      text-left text-[12.5px] font-semibold text-white/85
                      hover:border-gold/60 hover:bg-white/[0.04]
                      transition-colors"
                  >
                    <span aria-hidden="true"
                      className="text-gold/70 text-[9px] group-hover:text-gold
                        transition-colors">
                      ▶
                    </span>
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 注記：自由会話型AIではないことを明示 */}
          <p className="px-4 py-2.5 border-t border-white/10
            text-[10.5px] leading-[1.7] text-white/50">
            選択式のご案内です。会話内容は保存されません。
          </p>
        </div>
      )}
    </>
  )
}
