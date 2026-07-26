import { useState } from 'react'
import { FAQS } from '../data/site'
import { Section, SectionHead, IconChevron } from './ui'

export default function Faq() {
  // 開いている項目のindex（nullなら全て閉じている）
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <Section id="faq">
      <SectionHead
        en="FAQ"
        title="よくある質問"
        lead="ご相談前に多くいただく質問をまとめました。"
      />

      {/* アコーディオンの max-height 計算に transform が干渉するため、
          この一覧には reveal アニメーションを適用しない */}
      <div className="max-w-3xl">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i
          const panelId = `faq-panel-${i}`
          const buttonId = `faq-button-${i}`

          return (
            <div key={faq.q} className="border-b border-surface-line">
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-4
                    py-5 text-left group"
                >
                  <span className="flex items-start gap-3 min-w-0">
                    <span className="shrink-0 text-[13px] font-bold text-accent mt-0.5"
                      aria-hidden="true">Q</span>
                    <span className="text-[15px] font-bold text-navy leading-[1.7]
                      group-hover:text-accent transition-colors">
                      {faq.q}
                    </span>
                  </span>
                  <span className="shrink-0 mt-0.5 text-ink-light">
                    <IconChevron open={isOpen} />
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`faq-panel ${isOpen ? 'is-open' : ''}`}
              >
                <div className="flex items-start gap-3 pb-6">
                  <span className="shrink-0 text-[13px] font-bold text-ink-light mt-0.5"
                    aria-hidden="true">A</span>
                  <p className="text-[14px] leading-[1.9] text-ink-mid">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
