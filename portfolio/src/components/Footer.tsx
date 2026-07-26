import { SITE, NAV, CONTACT } from '../data/site'

export default function Footer() {
  return (
    <footer className="bg-navy-dark border-t border-white/8 py-12">
      <div className="max-w-content mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">

          {/* ブランド */}
          <div>
            <p className="text-[15px] font-bold text-white mb-1">{SITE.name}</p>
            <p className="text-[10px] font-semibold tracking-[0.2em]
              text-white/40 mb-4">{SITE.nameEn}</p>
            <p className="text-[13px] leading-[1.85] text-white/55 max-w-sm">
              {SITE.tagline}
            </p>
          </div>

          {/* ナビ・連絡先 */}
          <div className="sm:text-right">
            <nav className="flex flex-wrap sm:justify-end gap-x-5 gap-y-2 mb-6"
              aria-label="フッターナビゲーション">
              {NAV.map(item => (
                <a key={item.href} href={item.href}
                  className="text-[12.5px] text-white/60 hover:text-white transition-colors">
                  {item.label}
                </a>
              ))}
            </nav>
            <a href={CONTACT.mailto}
              className="text-[13px] text-white/70 hover:text-white
                transition-colors tracking-wide">
              {CONTACT.email}
            </a>
          </div>
        </div>

        <p className="mt-10 pt-6 border-t border-white/8
          text-[11px] text-white/35">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </footer>
  )
}
