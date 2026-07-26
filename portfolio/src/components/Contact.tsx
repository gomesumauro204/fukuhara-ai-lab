import { CONTACT, BOOKING } from '../data/site'
import {
  Section, SectionHead, Reveal,
  BookingButton, OutlineButton, IconMail, IconCheck,
} from './ui'

export default function Contact() {
  return (
    <Section id="contact" tone="dark">
      <SectionHead
        en="Contact"
        title="まずは現在のお困りごとをお聞かせください"
        lead="Webツールの開発が必要か分からない段階でも構いません。現在の業務を伺い、どこを改善できそうか整理します。"
        dark
        center
      />

      <div className="max-w-2xl mx-auto">

        {/* 無料相談（メイン導線） */}
        <Reveal className="bg-white/[0.06] border border-white/12 rounded-lg
          p-6 sm:p-9 text-center">
          <p className="text-[11px] font-bold tracking-[0.25em]
            text-accent-light/70 uppercase mb-4">
            Online Meeting
          </p>
          <p className="text-lg sm:text-xl font-bold text-white mb-6">
            30分の無料相談
          </p>

          <BookingButton variant="onDark" className="w-full sm:w-auto mb-6" />

          <ul className="flex flex-col sm:flex-row sm:justify-center
            gap-2 sm:gap-5">
            {BOOKING.notes.map(note => (
              <li key={note} className="flex items-center justify-center gap-2
                text-[13px] text-white/65">
                <span className="text-accent-light/80 shrink-0"><IconCheck /></span>
                {note}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* メール（サブ導線） */}
        <Reveal delay={1} className="mt-7 pt-7 border-t border-white/10 text-center">
          <p className="text-[14px] font-bold text-white mb-2">
            日程を決めず、まず文章で相談したい方
          </p>
          <p className="text-[13px] text-white/55 mb-5">
            内容を確認のうえ、メールでご返信します。
          </p>

          <OutlineButton href={CONTACT.mailto} onDark className="w-full sm:w-auto">
            <IconMail />
            メールで問い合わせる
          </OutlineButton>

          {/* メールアプリが開かない環境向けにアドレスも表示 */}
          <p className="mt-6 text-[13px] text-white/70 tracking-wide">
            <a href={CONTACT.mailto} className="hover:text-white transition-colors">
              {CONTACT.email}
            </a>
          </p>
          <p className="mt-2 text-[11.5px] text-white/40">
            メールアプリが開かない場合は、上記アドレスをコピーしてご利用ください
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
