import { HERO, BOOKING } from '../data/site'
import { BookingButton, LinkButton, MarkStar } from './ui'
import HeroVisual from './HeroVisual'

/**
 * ファーストビュー
 *
 * 構図：中央の縦長ビジュアル（光の柱）を軸に、巨大な明朝の見出しが
 * その前を横断する。柱に差しかかる位置で文字色が白→ゴールドへ変わる。
 * 四隅には極小の英字ラベルを配置し、ポスターのような画面をつくる。
 */
export default function Hero() {
  return (
    <section id="top"
      className="relative isolate overflow-hidden bg-navy
        min-h-[100svh] flex flex-col justify-center
        pt-20 sm:pt-24 pb-12">

      {/* ── 中央の縦長ビジュアル（背面） ── */}
      <div aria-hidden="true"
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-0
          w-[62vw] max-w-[400px] sm:w-[34vw] sm:max-w-[380px]
          opacity-70 sm:opacity-100">
        <div className="enter-fade d3 h-full">
          <HeroVisual />
        </div>
      </div>

      {/* ── 前景コンテンツ ── */}
      <div className="relative z-10 max-w-content mx-auto w-full
        px-5 sm:px-8 lg:px-12">

        {/* 右上のコーナーアンカー */}
        <div className="enter d2 hidden sm:block absolute right-8 lg:right-12
          -top-4 text-right">
          <MarkStar className="text-gold" />
          {HERO.labelTopRight.map(line => (
            <p key={line} className="label-en">{line}</p>
          ))}
        </div>

        {/* 巨大見出し：柱の前を横断する */}
        <h1 className="hero-headline mb-8 sm:mb-10">
          <span className="enter d1 block hero-line-top">
            {HERO.headlineTop}
          </span>
          {/*
            2行目：スマホでは語のまとまりで改行して3行構成にし、
            タブレット以上では1行にまとめて右へオフセットする。
          */}
          <span className="enter d2 block hero-line-bottom
            sm:pl-[10vw] lg:pl-[15vw] sm:whitespace-nowrap">
            {HERO.headlineBottom.map(part => (
              <span key={part} className="block sm:inline">{part}</span>
            ))}
          </span>
        </h1>

        {/* 説明文とCTA（柱と重ならないよう左寄せ・幅を制限） */}
        <div className="max-w-[26rem]">
          <p className="enter d3 text-[14px] sm:text-[15px] leading-[2]
            text-white/70 mb-9">
            {HERO.lead}
          </p>

          <div className="enter d4 flex flex-col sm:flex-row gap-3 mb-7">
            <BookingButton tone="gold" className="w-full sm:w-auto" />
            <LinkButton href="#works" tone="outline" className="w-full sm:w-auto">
              制作実績を見る
            </LinkButton>
          </div>

          <ul className="enter d5 flex flex-wrap gap-x-5 gap-y-1.5">
            {BOOKING.notes.map(note => (
              <li key={note} className="flex items-center gap-2 text-[11.5px] text-white/60">
                <span className="w-1 h-1 rounded-full bg-gold/70" aria-hidden="true" />
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* 左下のコーナーアンカー */}
        <div className="enter d6 mt-14 sm:mt-20">
          <MarkStar className="text-gold" />
          {HERO.labelBottom.map(line => (
            <p key={line} className="label-en">{line}</p>
          ))}
          <p className="label-en mt-1">— {HERO.labelNote}</p>
        </div>
      </div>

      {/* スクロールキュー */}
      <a href="#works" aria-label="制作実績へ移動"
        className="enter-fade d6 absolute bottom-6 left-1/2 -translate-x-1/2 z-10
          hidden sm:grid place-items-center w-10 h-10 rounded-full
          border border-white/20 text-white/50
          hover:border-gold/60 hover:text-gold transition-colors">
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
          <path d="M6 0v12M1.5 8L6 12.5L10.5 8" stroke="currentColor"
            strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  )
}
