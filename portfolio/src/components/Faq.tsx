import { useState } from 'react'
import { FAQS } from '../data/site'
import { Section, SectionHead, IconChevron } from './ui'

export default function Faq() {
  // 開いている項目のindex（nullなら全て閉じている）
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <Section id="faq" tone="paper">
      <SectionHead
        num="08"
        en="FAQ"
        title="よくある質問"
        lead="ご相談前に多くいただく質問をまとめました。"
      />

      {/*
        アコーディオンの max-height 計算に transform が干渉するため、
        この一覧には reveal アニメーションを適用しない。
      */}
      <div className="max-w-3xl border-t border-ink/12">
        {FAQS.map((faq, i) => {
          const isOpen  = openIndex === i
          const panelId = `faq-panel-${i}`
          const btnId   = `faq-button-${i}`

          return (
            <div key={faq.q} className="border-b border-ink/12">
              <h3>
                <button
                  type="button"
                  id={btnId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="group w-full flex items-start justify-between gap-5
                    py-5 text-left"
                >
                  <span className="flex items-start gap-4 min-w-0">
                    <span aria-hidden="true"
                      className="font-en text-[13px] text-gold-deep shrink-0 pt-0.5">
                      Q
                    </span>
                    <span className="text-[14.5px] sm:text-[15px] font-semibold
                      text-ink leading-[1.75] group-hover:text-ink-mid
                      transition-colors">
                      {faq.q}
                    </span>
                  </span>
                  <span className="shrink-0 pt-1 text-ink-soft">
                    <IconChevron open={isOpen} />
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                className={`faq-panel ${isOpen ? 'is-open' : ''}`}
              >
                <div className="flex items-start gap-4 pb-6 pr-8">
                  <span aria-hidden="true"
                    className="font-en text-[13px] text-ink-soft shrink-0 pt-0.5">
                    A
                  </span>
                  <p className="text-[14px] leading-[2] text-ink-mid">
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
