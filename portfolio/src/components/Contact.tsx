import { CONTACT, BOOKING } from '../data/site'
import { Section, Reveal, BookingButton, LinkButton, IconMail, MarkStar } from './ui'

/**
 * お問い合わせ：最暗の背景でサイトを締める。
 *
 * ファーストビューと同じ「成果を確認して安心する」世界観の写真を、
 * 別のトリミング・強めの暗いオーバーレイで再登場させ、サイト全体の
 * 起（Hero）と結（Contact）を対応させる。動きはフェードインのみに
 * 抑え、CTAへ視線が集中するようにする。
 */
export default function Contact() {
  return (
    <Section
      id="contact"
      tone="deep"
      background={
        <div className="contact-photo-wrap" aria-hidden="true">
          <picture>
            <source media="(max-width: 767px)" srcSet="/contact-results-sm.webp" />
            <img
              src="/contact-results.webp"
              alt=""
              width={1600}
              height={901}
              loading="lazy"
              decoding="async"
              className="contact-photo"
            />
          </picture>
          <div className="contact-photo-overlay" />
        </div>
      }
    >
      <Reveal kind="heading" className="mb-14 max-w-xl">
        <MarkStar className="text-gold" />
        <p className="label-en mt-3">Contact</p>
        <h2 className="font-mincho mt-5
          text-[1.7rem] sm:text-[2.2rem] lg:text-[2.6rem] text-white
          leading-[1.45]">
          まずは現在の<wbr />お困りごとを<br className="sm:hidden" />
          お聞かせください
        </h2>
        <p className="mt-6 text-[14.5px] leading-[2] text-white/55
          max-w-xl">
          Webツールの開発が必要か分からない段階でも構いません。
          現在の業務を伺い、どこを改善できそうか整理します。
        </p>
      </Reveal>

      {/* 無料相談（主導線） */}
      <Reveal kind="cta" delay={2} className="max-w-lg border border-gold/35
        bg-navy-deep/40 backdrop-blur-sm rounded-sm p-8 sm:p-11">
        <p className="label-en" style={{ color: '#D9BE83' }}>
          Online Meeting
        </p>
        <p className="font-mincho text-[1.4rem] sm:text-[1.7rem] text-white
          mt-4 mb-8">
          30分の無料相談
        </p>

        <BookingButton tone="solidGold" className="w-full sm:w-auto" />

        <ul className="mt-8 flex flex-col sm:flex-row
          gap-2 sm:gap-6">
          {BOOKING.notes.map(note => (
            <li key={note} className="flex items-center gap-2
              text-[12.5px] text-white/60">
              <span className="w-1 h-1 rounded-full bg-gold/70" aria-hidden="true" />
              {note}
            </li>
          ))}
        </ul>
      </Reveal>

      {/* メール（副導線） */}
      <Reveal kind="cta" delay={3}
        className="max-w-lg mt-10 pt-10 border-t border-white/10">
        <p className="text-[14px] font-semibold text-white mb-2">
          日程を決めず、まず文章で相談したい方
        </p>
        <p className="text-[12.5px] text-white/55 mb-7">
          内容を確認のうえ、メールでご返信します。
        </p>

        <LinkButton href={CONTACT.mailto} tone="outline"
          className="w-full sm:w-auto">
          <span className="inline-flex items-center gap-2">
            <IconMail />
            メールで問い合わせる
          </span>
        </LinkButton>

        {/* メールアプリが開かない環境向けにアドレスも表示 */}
        <p className="mt-8">
          <a href={CONTACT.mailto}
            className="font-en text-[14px] text-white/65 hover:text-gold
              transition-colors"
            style={{ letterSpacing: '0.06em' }}>
            {CONTACT.email}
          </a>
        </p>
        <p className="mt-2 text-[11px] text-white/55">
          メールアプリが開かない場合は、上記アドレスをコピーしてご利用ください
        </p>
      </Reveal>
    </Section>
  )
}
