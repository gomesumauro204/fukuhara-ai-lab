import { useRef } from 'react'
import { HERO, BOOKING } from '../data/site'
import { useHeroMotion } from '../hooks/useHeroMotion'
import { BookingButton, LinkButton, MarkStar } from './ui'
import HeroAmbience from './HeroAmbience'
import HeroShowcase from './HeroShowcase'

/**
 * ファーストビュー
 *
 * 構図：右側〜背景側に「業務画面が斜めに流れるショーケース」を配置し、
 * 会議室写真は薄く残す土台として奥に沈める。見出し・本文・CTAは
 * 左〜中央に置き、.hero-photo-overlay の暗幕で可読性を確保する。
 *
 * 登場：数字/ラベル・見出し・本文・画像・CTAで異なる移動量・時間を使う
 * （enter-label / enter-heading / enter-body / enter-image / enter-cta）。
 *
 * 奥行き：背景アンビエンス・前景の2層を異なる量で動かす。
 * 量は useHeroMotion が設定する --mx / --my / --sy を CSS 側で使う。
 *   背景  … 最も大きく遅れて動く（遠景）
 *   前景  … 背景より控えめ（手前）
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
      {/* ── 第0層：会議室写真（うっすら奥に残す土台） ──
          世界観・信頼感を補強する程度に薄く残し、主役にはしない。
          アンビエンス・ショーケース・文字より必ず背面に置く。
          初回表示時のみゆっくりズームし、ループはしない。 */}
      <div className="hero-photo" aria-hidden="true" />

      {/* ── 第0.5層：斜めに流れる業務画面ショーケース（新しい主役） ──
          ダッシュボード・入力フォーム・一覧・進捗管理・通知UIなどが
          斜め方向へゆっくり無限ループし、業務改善サービスであることを
          直感的に伝える。実画像は public/hero-showcase/ に置くと
          自動で差し替わる（無い間は簡易モック＝仮素材を表示）。 */}
      <HeroShowcase />

      {/* 会議室写真とショーケースの上に重ねる、画面全体では薄い暗幕。
          左右差をほぼ無くし、業務画面が画面全体で見えるようにする
          （以前は左〜中央を強く覆っていたが、文字の可読性は
          hero-textzone-glow と各要素のtext-shadowで局所的に確保する）。 */}
      <div className="hero-photo-overlay" aria-hidden="true" />

      {/* 見出し・本文・CTAの足元だけに効く局所的な暗がり。
          画面全体を暗くする代わりに、文字が乗る範囲の裏側だけを
          柔らかくぼかして沈める（輪郭のはっきりした四角には見えない
          よう、中心から外へ滲むグラデーションにしている）。 */}
      <div className="hero-textzone-glow" aria-hidden="true" />

      {/* ── 第1層：背景アンビエンス（最も遅れて動く） ── */}
      <div className="hero-amb">
        <HeroAmbience />
      </div>

      {/* ── 第2層：前景コンテンツ ── */}
      <div className="hero-fg relative z-10 max-w-content mx-auto w-full
        px-5 sm:px-8 lg:px-12">

        {/* 巨大見出し：柱の前を横断する。
            text-shadowで文字の輪郭にだけ影を落とし、背景が
            動いていても文字自体はくっきり読めるようにする */}
        <h1 className="hero-headline hero-text-shadow mb-8 sm:mb-10">
          <span className="enter-heading d1 block hero-line-top">
            {HERO.headlineTop}
          </span>
          {/*
            2行目：スマホでは語のまとまりで改行して3行構成にし、
            タブレット以上では1行にまとめて右へオフセットする。
          */}
          <span className="enter-heading d2 block hero-line-bottom
            sm:pl-[3vw] lg:pl-[2rem] sm:whitespace-nowrap">
            {HERO.headlineBottom.map(part => (
              <span key={part} className="block sm:inline">{part}</span>
            ))}
          </span>
        </h1>

        {/* 説明文とCTA（柱と重ならないよう左寄せ・幅を制限） */}
        <div className="max-w-[26rem]">
          <p className="enter-body d3 hero-text-shadow-soft text-[14px] sm:text-[15px] leading-[2]
            text-white/70 mb-9">
            {HERO.lead}
          </p>

          <div className="enter-cta d4 flex flex-col sm:flex-row gap-3 mb-7">
            {/* 視線リレーの最後の受け皿。5.6秒以降、ごく弱く呼吸させる */}
            <div className="hero-cta-breathe w-full sm:w-auto">
              <BookingButton tone="gold" className="w-full sm:w-auto" />
            </div>
            <LinkButton href="#works" tone="outline"
              className="hero-cta-outline w-full sm:w-auto">
              制作実績を見る
            </LinkButton>
          </div>

          <ul className="enter-fade d5 hero-text-shadow-soft flex flex-wrap gap-x-5 gap-y-1.5">
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
          <p className="label-en mt-1.5">— {HERO.labelNote}</p>
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
