import { useRef } from 'react'
import { HERO, BOOKING } from '../data/site'
import { useHeroMotion } from '../hooks/useHeroMotion'
import { BookingButton, LinkButton, MarkStar } from './ui'
import HeroAmbience from './HeroAmbience'
import HeroVisual from './HeroVisual'

/**
 * ファーストビュー
 *
 * 構図：中央の縦長ビジュアル（光の柱）を軸に、巨大な明朝の見出しが
 * その前を横断する。柱に差しかかる位置で文字色が白→ゴールドへ変わる。
 *
 * 登場：数字/ラベル・見出し・本文・画像・CTAで異なる移動量・時間を使う
 * （enter-label / enter-heading / enter-body / enter-image / enter-cta）。
 *
 * 奥行き：背景アンビエンス・柱・前景の3層を異なる量で動かす。
 * 量は useHeroMotion が設定する --mx / --my / --sy を CSS 側で使う。
 *   背景  … 最も大きく遅れて動く（遠景）
 *   柱    … 中間
 *   前景  … 背景・柱より控えめ（手前）
 */
export default function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  useHeroMotion(rootRef)

  return (
    <section
      id="top"
      ref={rootRef}
      className="hero-root relative isolate overflow-hidden bg-navy
        min-h-[100svh] flex flex-col justify-center
        pt-20 sm:pt-24 pb-12"
    >
      {/* ── 第1層：背景アンビエンス（最も遅れて動く） ── */}
      <div className="hero-amb">
        <HeroAmbience />
      </div>

      {/* ── 第2層：中央の縦長ビジュアル ── */}
      <div className="hero-pillar-wrap" aria-hidden="true">
        <div className="enter-image d3 h-full">
          <HeroVisual />
        </div>
      </div>

      {/* ── 第3層：前景コンテンツ ── */}
      <div className="hero-fg relative z-10 max-w-content mx-auto w-full
        px-5 sm:px-8 lg:px-12">

        {/* 右上のコーナーアンカー */}
        <div className="enter-label d2 hidden sm:block absolute right-8 lg:right-12
          -top-4 text-right">
          <MarkStar className="text-gold" />
          {HERO.labelTopRight.map(line => (
            <p key={line} className="label-en">{line}</p>
          ))}
        </div>

        {/* 巨大見出し：柱の前を横断する。
            初期表示は enter-heading（一度きり）、スクロール中の縮小・
            退場は hero-scene-heading（--sy連動）が外側で担当する。 */}
        <div className="hero-scene-heading">
          <h1 className="hero-headline mb-8 sm:mb-10">
            <span className="enter-heading d1 block hero-line-top">
              {HERO.headlineTop}
            </span>
            {/*
              2行目：スマホでは語のまとまりで改行して3行構成にし、
              タブレット以上では1行にまとめて右へオフセットする。
            */}
            <span className="enter-heading d2 block hero-line-bottom
              sm:pl-[10vw] lg:pl-[15vw] sm:whitespace-nowrap">
              {HERO.headlineBottom.map(part => (
                <span key={part} className="block sm:inline">{part}</span>
              ))}
            </span>
          </h1>
        </div>

        {/* 説明文とCTA（柱と重ならないよう左寄せ・幅を制限）。
            説明文とCTAは見出しより速く退場し、次のセクションへ場を譲る。 */}
        <div className="max-w-[26rem]">
          <div className="hero-scene-desc">
            <p className="enter-body d3 text-[14px] sm:text-[15px] leading-[2]
              text-white/70 mb-9">
              {HERO.lead}
            </p>
          </div>

          <div className="hero-scene-cta">
            <div className="enter-cta d4 flex flex-col sm:flex-row gap-3 mb-7">
              <BookingButton tone="gold" className="w-full sm:w-auto" />
              <LinkButton href="#works" tone="outline" className="w-full sm:w-auto">
                制作実績を見る
              </LinkButton>
            </div>
          </div>

          <ul className="enter-fade d5 flex flex-wrap gap-x-5 gap-y-1.5">
            {BOOKING.notes.map(note => (
              <li key={note} className="flex items-center gap-2 text-[11.5px] text-white/60">
                <span className="w-1 h-1 rounded-full bg-gold/70" aria-hidden="true" />
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* 左下のコーナーアンカー */}
        <div className="enter-label d6 mt-14 sm:mt-20">
          <MarkStar className="text-gold" />
          {HERO.labelBottom.map(line => (
            <p key={line} className="label-en">{line}</p>
          ))}
          <p className="label-en mt-1">— {HERO.labelNote}</p>
        </div>
      </div>

      {/* 次のセクション（制作実績）の気配。スクロールすると下から侵入する */}
      <div className="hero-next-peek" aria-hidden="true">
        <span className="section-num text-white/10" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>01</span>
        <p className="label-en">Works ／ 制作実績</p>
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
