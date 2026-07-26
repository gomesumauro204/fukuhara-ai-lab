import { useEffect, useState } from 'react'
import type { Work } from '../data/works'
import { useScrollScene } from '../hooks/useScrollScene'
import { BookingButton, LinkButton, IconExternal } from './ui'
import { DesktopScreen, PhoneScreen, useImageExists } from './ScreenFrame'

/**
 * 制作実績のスクロールシーン。
 *
 * 1つの作品につき画面何個分もの高さ（PC 460vh／スマホ 300vh）を持つ
 * コンテナの中で、内部の描画エリアだけを画面に固定（sticky）し、
 * スクロール量に応じて主役が入れ替わる「場面転換」を作る。
 *
 *   Stage 1  番号・英字ラベル・セクション見出しが主役
 *   Stage 2  ツール名が主役（イントロは左上へ縮み退場）
 *   Stage 3  ビジュアル（実画面 or 抽象UIパネル）が立ち上がる
 *   Stage 4  「解決する課題」が現れる
 *   Stage 5  課題が退場し「主要機能」へ切り替わる
 *   Stage 6  デモ・相談のCTAが現れる
 *
 * 進捗は useScrollScene が --s1〜--s6 として書き込み、各要素は
 * CSS の calc() だけで opacity・transform を組み立てる
 * （transform/opacityのみ。Reactの再描画は起こさない）。
 *
 * prefers-reduced-motion では、ピン留め演出そのものを行わず、
 * 全情報を普通に縦積みした静的なカードを表示する
 * （「全部見せない」演出は動きが前提のため、動きを止める設定では
 * 情報を隠さない方向を優先する）。
 */
export default function WorksScene({ work, index }: { work: Work; index: number }) {
  const reduceMotion = usePrefersReducedMotion()
  return reduceMotion
    ? <WorksStatic work={work} index={index} />
    : <WorksPinned work={work} index={index} />
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    const onChange = () => setReduce(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduce
}

// =================================================================
// ピン留めシーン（通常時）
// =================================================================
function WorksPinned({ work, index }: { work: Work; index: number }) {
  const num = String(index + 1).padStart(2, '0')
  const sceneRef = useScrollScene<HTMLDivElement>()

  return (
    <div className="scene-wrap" ref={sceneRef}>
      <div className="scene-sticky">
        <div className="scene-inner">

          {/* Stage 1: セクション番号・英字ラベル・見出し */}
          <div className="scene-intro">
            <span className="section-num text-white/10" aria-hidden="true">
              {num}
            </span>
            <p className="label-en mt-2">Works</p>
            <h2 className="font-mincho mt-2 text-[1.9rem] sm:text-[2.4rem] text-white">
              制作実績
            </h2>
          </div>

          {/* Stage 2: ツール名が主役 */}
          <div className="scene-title">
            <p className="label-en mb-4">{work.badge} ／ {work.target}</p>
            <h3 className="font-mincho text-[1.9rem] sm:text-[2.8rem] lg:text-[3.4rem]
              text-white leading-[1.25] max-w-3xl break-words">
              {work.title}
            </h3>
          </div>

          {/* PC：ビジュアルを右、詳細を左に。スマホ：縦積み */}
          <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-14 items-center pt-[38vh] sm:pt-[30vh] lg:pt-0">

            {/* Stage 3: ビジュアル（実画面 or 抽象UIパネル） */}
            <div className="scene-visual lg:order-2">
              <SceneVisual work={work} />
            </div>

            {/* 詳細ゾーン：Stage 4〜6 が入れ替わる */}
            <div className="scene-detail lg:order-1 min-h-[13rem] sm:min-h-[15rem]">
              {/* Stage 4: 解決する課題（Stage5開始で退場） */}
              <div className="scene-problem scene-detail-slot">
                <p className="label-en mb-3">Problem</p>
                <p className="text-[14px] sm:text-[15px] leading-[1.95] text-white/70 max-w-md">
                  {work.problem}
                </p>
              </div>

              {/* Stage 5: 主要機能（現れたら持続） */}
              <div className="scene-features">
                <p className="label-en mb-4">Key Features</p>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 max-w-md">
                  {work.features.map(f => (
                    <li key={f.name} className="flex items-start gap-2 text-[13px] text-white/80">
                      <span className="w-1 h-1 rounded-full bg-gold/70 mt-2 shrink-0" aria-hidden="true" />
                      <span className="break-words">{f.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stage 6: CTA（最後に現れる） */}
              <div className="scene-cta mt-7 flex flex-col sm:flex-row gap-3">
                {work.demoUrl ? (
                  <LinkButton href={work.demoUrl} external tone="solidGold" className="w-full sm:w-auto">
                    デモを見る
                    <IconExternal />
                  </LinkButton>
                ) : (
                  <span className="inline-flex items-center justify-center rounded-full
                    px-7 py-4 text-[13.5px] font-semibold text-white/30 border border-white/10">
                    準備中
                  </span>
                )}
                <BookingButton tone="outline" label="このようなツールを相談する" className="w-full sm:w-auto" />
              </div>
            </div>
          </div>

          {/* 進捗インジケーター（PCのみ）。各ドットは自分のステージ
              進捗（--s1〜--s6）でそのまま光る（CSSのみ、JS計算なし） */}
          <div className="scene-progress hidden lg:flex" aria-hidden="true">
            <span className="scene-progress-dot" />
            <span className="scene-progress-dot" />
            <span className="scene-progress-dot" />
            <span className="scene-progress-dot" />
            <span className="scene-progress-dot" />
            <span className="scene-progress-dot" />
          </div>
        </div>
      </div>
    </div>
  )
}

// =================================================================
// ビジュアル：画像があれば実画面、なければ抽象UIパネル
// =================================================================
function SceneVisual({ work }: { work: Work }) {
  const hasImage = useImageExists(work.images.pc) === true

  if (hasImage) {
    return (
      <div className="relative w-full max-w-md mx-auto lg:mx-0">
        <DesktopScreen src={work.images.pc} alt={`${work.title}のPC画面`} />
        <div className="absolute -bottom-6 right-2 sm:-right-6 w-[20%] max-w-[96px]">
          <PhoneScreen src={work.images.sp} alt={`${work.title}のスマートフォン画面`} />
        </div>
      </div>
    )
  }

  return <AbstractPanel />
}

/**
 * 抽象UIパネル（画像未登録時）。
 * 実在しない画面のふりはせず、業務フロー・データ処理を連想させる
 * 抽象的な構成要素（行・状態バッジ・チップ）だけで組み立てる。
 */
function AbstractPanel() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0
      border border-white/14 rounded-md bg-navy-lift/60 p-6 sm:p-7"
      style={{ boxShadow: '0 30px 70px -30px rgba(0,0,0,0.7)' }}
      aria-hidden="true">
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r
        from-transparent via-gold/50 to-transparent" />

      <div className="flex items-center justify-between mb-5">
        <span className="grid place-items-center w-7 h-7 rounded-[3px]
          border border-gold/40 text-gold font-en text-[12px]">F</span>
        <span className="sec-chip" style={{
          position: 'static', color: 'rgba(150,190,245,0.6)', borderColor: 'rgba(150,190,245,0.6)',
        }} />
      </div>

      <div className="flex flex-col gap-2.5">
        {[74, 58, 66, 42].map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className={`w-1 h-4 rounded-full shrink-0
              ${i === 1 ? 'bg-gold/70' : 'bg-white/15'}`} />
            <span className="h-2 rounded-sm bg-white/12" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>

      <p className="mt-6 text-[10px] text-white/40 font-en uppercase"
        style={{ letterSpacing: '0.24em' }}>
        UI Preview — Abstract
      </p>
    </div>
  )
}

// =================================================================
// 静的表示（prefers-reduced-motion 時。動きを止め、全情報を縦積み）
// =================================================================
function WorksStatic({ work, index }: { work: Work; index: number }) {
  return (
    <article className="max-w-content mx-auto px-5 sm:px-8 lg:px-12 py-16">
      <p className="label-en mb-3">
        {String(index + 1).padStart(2, '0')} ／ {work.badge} ／ {work.target}
      </p>
      <h3 className="font-mincho text-[1.6rem] sm:text-[2rem] text-white mb-6 leading-[1.4]">
        {work.title}
      </h3>

      <SceneVisual work={work} />

      <div className="mt-8">
        <p className="label-en mb-2.5">Problem</p>
        <p className="text-[14px] leading-[1.95] text-white/70 max-w-lg mb-8">
          {work.problem}
        </p>

        <p className="label-en mb-3.5">Key Features</p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 max-w-md mb-8">
          {work.features.map(f => (
            <li key={f.name} className="flex items-start gap-2 text-[13px] text-white/80">
              <span className="w-1 h-1 rounded-full bg-gold/70 mt-2 shrink-0" aria-hidden="true" />
              <span className="break-words">{f.name}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3">
          {work.demoUrl ? (
            <LinkButton href={work.demoUrl} external tone="solidGold" className="w-full sm:w-auto">
              デモを見る
              <IconExternal />
            </LinkButton>
          ) : (
            <span className="inline-flex items-center justify-center rounded-full
              px-7 py-4 text-[13.5px] font-semibold text-white/30 border border-white/10">
              準備中
            </span>
          )}
          <BookingButton tone="outline" label="このようなツールを相談する" className="w-full sm:w-auto" />
        </div>
      </div>
    </article>
  )
}
