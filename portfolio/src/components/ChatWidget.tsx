import { useEffect, useRef, useState } from 'react'
import { SITE, BOOKING, CONTACT } from '../data/site'
import { WORKS } from '../data/works'

// =============================================================
// 選択式チャット（AI APIは使用しません）
// 表示 / 非表示は data/site.ts の FEATURES.chatWidget で切り替え
// 文言・選択肢を変更する場合は下の OPTIONS を編集してください
// =============================================================

type Action =
  | { kind: 'reply'; text: string }              // 案内文を表示
  | { kind: 'scroll'; href: string; text: string } // セクションへ移動
  | { kind: 'link'; url: string; text: string }    // 外部ページを開く

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
      text: '入力フォーム、記録・管理画面、検索、集計などの小規模Webツールを設計・開発しています。支援内容をご覧ください。',
    },
  },
  {
    label: '依頼の流れを知りたい',
    action: {
      kind: 'scroll',
      href: '#process',
      text: '無料相談 → 課題・要件の整理 → ご提案・お見積もり → 試作・開発 → 確認・改善・納品の順で進めます。',
    },
  },
  {
    label: '介護申し送りツールを見る',
    action: {
      kind: 'link',
      url: WORKS[0].demoUrl,
      text: '自主開発のデモツールを別のタブで開きます。',
    },
  },
  {
    label: '無料相談を予約する',
    action: {
      kind: 'link',
      url: BOOKING.url,
      text: '予約ページを別のタブで開きます。オンライン30分・無料です。',
    },
  },
  {
    label: 'メールで問い合わせる',
    action: {
      kind: 'link',
      url: CONTACT.mailto,
      text: `メールでのご相談も承ります（${CONTACT.email}）。`,
    },
  },
]

const GREETING = `こんにちは。${SITE.name}です。\nご希望の内容をお選びください。`

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [reply, setReply] = useState<string | null>(null)

  const panelRef  = useRef<HTMLDivElement>(null)
  const launchRef = useRef<HTMLButtonElement>(null)

  // Escapeで閉じる
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        launchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // 開いたらパネル内へフォーカスを移す
  useEffect(() => {
    if (open) {
      panelRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    }
  }, [open])

  function handleSelect(option: Option) {
    const { action } = option
    setReply(action.text)

    if (action.kind === 'scroll') {
      setOpen(false)
      // ハッシュを変更してブラウザ標準のアンカー遷移で移動する
      window.location.hash = action.href
    } else if (action.kind === 'link') {
      // mailto は同一タブ、外部URLは新しいタブ
      if (action.url.startsWith('mailto:')) {
        window.location.href = action.url
      } else {
        window.open(action.url, '_blank', 'noopener,noreferrer')
      }
    }
  }

  return (
    <>
      {/* ── 起動ボタン ── */}
      <button
        ref={launchRef}
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls="chat-panel"
        className="chat-launcher flex items-center gap-2 px-4 py-3
          bg-navy text-white text-[13px] font-bold rounded-full
          shadow-lg hover:bg-navy-light transition-colors"
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor"
              strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v6A1.5 1.5 0 0112.5 11H6l-3 2.5V11H3.5A1.5 1.5 0 012 9.5v-6z"
              stroke="currentColor" strokeWidth="1.4"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {open ? '閉じる' : 'ご相談案内'}
      </button>

      {/* ── パネル ── */}
      {open && (
        <div
          id="chat-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="ご相談案内"
          className="chat-panel bg-white border border-surface-line
            rounded-xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* ヘッダー */}
          <div className="flex items-start justify-between gap-3
            px-4 py-3.5 bg-navy">
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-white leading-tight">
                ご相談案内
              </p>
              <p className="text-[10px] text-white/50 mt-0.5">
                {SITE.nameEn}
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setOpen(false); launchRef.current?.focus() }}
              aria-label="閉じる"
              className="shrink-0 -mr-1 p-1 text-white/60 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor"
                  strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* 本文 */}
          <div className="p-4 overflow-y-auto flex-1">
            <p className="text-[13px] leading-[1.8] text-ink-mid
              bg-surface-soft rounded-lg px-3.5 py-3 mb-3 whitespace-pre-line">
              {GREETING}
            </p>

            {/* 選択に対する案内文 */}
            {reply && (
              <p className="text-[13px] leading-[1.8] text-navy
                bg-accent-light rounded-lg px-3.5 py-3 mb-3">
                {reply}
              </p>
            )}

            {/* 選択肢 */}
            <ul className="space-y-2">
              {OPTIONS.map(option => (
                <li key={option.label}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="w-full text-left text-[13px] font-semibold text-navy
                      border border-surface-line rounded-lg px-3.5 py-2.5
                      hover:border-navy hover:bg-surface-soft transition-colors"
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 注記 */}
          <p className="px-4 py-2.5 text-[10.5px] text-ink-light
            border-t border-surface-line bg-surface-soft">
            選択式のご案内です。会話内容は保存されません。
          </p>
        </div>
      )}
    </>
  )
}
