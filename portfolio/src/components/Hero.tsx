import { SITE, BOOKING } from '../data/site'
import { WORKS } from '../data/works'
import { BookingButton, OutlineButton, IconCheck } from './ui'
import { BrowserMock, PhoneMock } from './Mockup'

export default function Hero() {
  const work = WORKS[0]

  return (
    <section id="top"
      className="relative overflow-hidden bg-surface-soft
        pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-20 lg:pb-24">

      {/* 背景：ドットグリッドと細いライン（控えめ） */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="hero-dots" />
        <div className="hero-line left-0 right-0 top-[28%]" />
        <div className="hero-line left-0 right-0 top-[62%]"
          style={{ animationDelay: '6s' }} />
      </div>

      <div className="relative max-w-content mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]
          gap-12 lg:gap-14 items-center">

          {/* ── 左：コピーとCTA ── */}
          <div>
            <p className="hero-item hero-d1 text-[11px] font-bold tracking-[0.28em]
              text-accent uppercase mb-5">
              {SITE.nameEn}
            </p>

            {/* メインコピー：スマホでも2〜3行に収める */}
            <h1 className="hero-item hero-d2 text-[1.85rem] leading-[1.34]
              sm:text-[2.4rem] lg:text-[2.6rem] xl:text-[2.9rem]
              text-navy mb-6 whitespace-nowrap">
              現場の課題を、<br />
              使われる仕組みに変える。
            </h1>

            <p className="hero-item hero-d3 text-body-lg text-ink-mid
              mb-4 max-w-xl">
              業務内容を整理し、入力・記録・検索・共有・管理を効率化する
              Webツールを設計・開発します。
            </p>

            <p className="hero-item hero-d4 text-[13px] font-semibold
              text-ink-light mb-8">
              {SITE.tagline}
            </p>

            {/* CTA */}
            <div className="hero-item hero-d4 flex flex-col sm:flex-row gap-3 mb-5">
              <BookingButton className="w-full sm:w-auto" />
              <OutlineButton href="#works" className="w-full sm:w-auto">
                制作実績を見る
              </OutlineButton>
            </div>

            {/* CTA補足 */}
            <ul className="hero-item hero-d5 flex flex-col gap-1.5">
              {[...BOOKING.notes, 'ツール化できるか分からない段階でもご相談いただけます']
                .map(note => (
                  <li key={note} className="flex items-start gap-2 text-[13px] text-ink-mid">
                    <span className="text-accent mt-1 shrink-0"><IconCheck /></span>
                    {note}
                  </li>
                ))}
            </ul>
          </div>

          {/* ── 右：制作したツールのモックアップ ── */}
          <div className="hero-item hero-d5 relative">
            <div className="mock-float">
              <BrowserMock
                src={work.images.pc}
                alt={`${work.title}のPC画面`}
              />
            </div>

            {/* スマホ画面を重ねる */}
            <div className="hero-item hero-d6 absolute -bottom-6 -left-2 sm:left-2
              w-[26%] max-w-[130px] sm:max-w-[150px]">
              <PhoneMock
                src={work.images.sp}
                alt={`${work.title}のスマートフォン画面`}
              />
            </div>

            {/* ツール名のキャプション */}
            <p className="hero-item hero-d6 mt-9 sm:mt-8 text-right text-[11px]
              text-ink-light tracking-wide">
              {work.title}（{work.badge}）
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
