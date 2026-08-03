import { useEffect, useRef, useState } from 'react'
import { BOOKING } from '../data/site'
import {
  GREETING, ROOT_OPTIONS, CHAT_NODES,
  type ChatButton, type ChatBodyBlock, type ChatNode,
} from '../data/chatbot'
import ChatCat from './ChatCat'

// =============================================================
// ご相談案内（選択式・分岐式）
//
// 自由入力のAIチャットではありません。あらかじめ用意した質問・回答を
// たどるだけの案内窓口で、訪問者が依頼前に感じる疑問の多くは
// チャット内で完結し、本人が選んだ場合だけ無料相談や制作実績など
// 別の場所へ進みます。
//
// 質問・回答・関連ボタン・遷移先はすべて data/chatbot.ts で管理して
// おり、新しい項目を増やす場合もこのファイル（表示ロジック）は
// 書き換えず、データを1件追加するだけで反映されます。
// =============================================================

/** 'root' は data/chatbot.ts に定義を持たない特別な画面（冒頭文＋5択） */
const ROOT_ID = 'root'

function renderBody(block: ChatBodyBlock, key: number) {
  if (block.type === 'p') {
    return (
      <p key={key} className="text-[12.5px] leading-[1.9] text-white/75 mb-3 last:mb-0">
        {block.text}
      </p>
    )
  }
  if (block.type === 'ul') {
    return (
      <ul key={key} className="mb-3 last:mb-0 space-y-1.5">
        {block.items.map(item => (
          <li key={item} className="flex items-start gap-2 text-[12.5px]
            leading-[1.8] text-white/75">
            <span className="w-1 h-1 rounded-full bg-gold/70 mt-[9px] shrink-0" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }
  // steps：番号付きの手順（タイトルを金色・やや太字、説明はその下）
  return (
    <ol key={key} className="mb-3 last:mb-0 space-y-2.5">
      {block.items.map(step => (
        <li key={step.title}>
          <p className="text-[12px] font-semibold text-gold-bright">{step.title}</p>
          <p className="mt-0.5 text-[12px] leading-[1.8] text-white/70">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  // ナビゲーション履歴。空 = 最初のメニュー（root）
  const [stack, setStack] = useState<string[]>([])

  const panelRef = useRef<HTMLDivElement>(null)
  const bodyRef   = useRef<HTMLDivElement>(null)
  const launchRef = useRef<HTMLButtonElement>(null)

  const currentId = stack[stack.length - 1] ?? ROOT_ID
  const currentNode: ChatNode | null = currentId === ROOT_ID ? null : CHAT_NODES[currentId]

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

  // 画面（root / 各質問）が切り替わったら、内部スクロールを先頭へ戻す
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [currentId])

  function closePanel() {
    setOpen(false)
    // 次回開いたときは必ず最初のメニューから
    setStack([])
    launchRef.current?.focus()
  }

  function goto(id: string) {
    setStack(prev => [...prev, id])
  }

  function goBack() {
    setStack(prev => prev.slice(0, -1))
  }

  function goHome() {
    setStack([])
  }

  function handleButton(btn: ChatButton) {
    if (btn.action) {
      if (btn.action.kind === 'booking') {
        // 予約ページ：外部ページなので新しいタブで開く（現在のタブは維持）
        window.open(BOOKING.url, '_blank', 'noopener,noreferrer')
        return
      }
      // サイト内セクションへの移動：同一タブ内のページ内遷移
      setOpen(false)
      setStack([])
      window.location.hash = btn.action.href
      return
    }
    if (btn.targetId) {
      if (btn.targetId === ROOT_ID) {
        goHome()
      } else {
        goto(btn.targetId)
      }
    }
  }

  function renderButton(btn: ChatButton, variant: 'primary' | 'secondary' = 'primary') {
    return (
      <li key={btn.label}>
        <button
          type="button"
          onClick={() => handleButton(btn)}
          className={`group w-full flex items-center gap-2.5 rounded-md
            border px-3.5 py-2.5 text-left text-[12.5px] font-semibold
            transition-colors
            ${variant === 'primary'
              ? 'border-white/15 text-white/85 hover:border-gold/60 hover:bg-white/[0.04]'
              : 'border-white/10 text-white/55 hover:border-white/30 hover:text-white/80'}`}
        >
          <span aria-hidden="true"
            className={`text-[9px] transition-colors
              ${variant === 'primary' ? 'text-gold/70 group-hover:text-gold' : 'text-white/30'}`}>
            ▶
          </span>
          {btn.label}
        </button>
      </li>
    )
  }

  return (
    <>
      {/* ── 起動：PC は右端の「ボタン＋案内する猫」── */}
      {!open && (
        <div className="chat-teaser-wrap hidden lg:flex flex-col items-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={false}
            aria-controls="chat-panel"
            className="chat-cta-standalone"
          >
            ご相談はこちら
          </button>
          <span className="text-[9px] text-white/50 leading-tight whitespace-nowrap mt-1.5">
            30分・無料でご相談できます
          </span>

          <svg className="chat-point-arrow chat-point-arrow-up" width="14" height="14"
            viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 9l4-4 4 4" stroke="currentColor" strokeWidth="1.4"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div className="chat-cat-wrap relative w-28 h-28" aria-hidden="true">
            <ChatCat />
            <span className="chat-online-dot chat-online-dot-cat" />
          </div>
        </div>
      )}

      {/* ── 起動：スマホは右下の「ボタン＋案内する猫」── */}
      {!open && (
        <div className="chat-launcher-sp-wrap lg:hidden flex flex-col items-center">
          <button
            ref={launchRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={false}
            aria-controls="chat-panel"
            className="chat-cta-standalone chat-cta-standalone-sp"
          >
            ご相談はこちら
          </button>

          <svg className="chat-point-arrow chat-point-arrow-up" width="10" height="10"
            viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 9l4-4 4 4" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div className="chat-cat-wrap relative w-11 h-11" aria-hidden="true">
            <ChatCat />
            <span className="chat-online-dot chat-online-dot-cat" />
          </div>
        </div>
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
              {stack.length > 0 && (
                <button type="button" onClick={goBack}
                  className="text-[11.5px] text-white/45 hover:text-white
                    transition-colors">
                  戻る
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

          {/* 本文（この内側だけスクロールする） */}
          <div ref={bodyRef} className="chat-body-scroll flex-1 overflow-y-auto px-4 py-4">
            {currentNode === null ? (
              <>
                {GREETING.map(line => (
                  <p key={line}
                    className="border-l-2 border-gold/60 pl-3 mb-3
                      text-[12.5px] leading-[1.85] text-white/75">
                    {line}
                  </p>
                ))}

                <ul className="mt-4 space-y-2">
                  {ROOT_OPTIONS.map(opt => renderButton(opt))}
                </ul>
              </>
            ) : (
              <>
                <h3 className="text-[13px] font-semibold text-gold-bright mb-3">
                  {currentNode.heading}
                </h3>

                {currentNode.body && currentNode.body.map((block, i) => renderBody(block, i))}

                {currentNode.options && (
                  <ul className="mt-4 space-y-2">
                    {currentNode.options.map(opt => renderButton(opt))}
                  </ul>
                )}

                {currentNode.related && (
                  <ul className="mt-5 pt-4 border-t border-white/10 space-y-2">
                    {currentNode.related.map(btn => renderButton(
                      btn, btn.targetId === ROOT_ID ? 'secondary' : 'primary',
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          {/* 注記：自由入力型AIチャットではないことを明示 */}
          <p className="px-4 py-2.5 border-t border-white/10
            text-[10.5px] leading-[1.7] text-white/50">
            選択式のご案内です。会話履歴は保存されません。
          </p>
        </div>
      )}
    </>
  )
}
