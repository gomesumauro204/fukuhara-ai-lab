import { SITE, NAV, CONTACT } from '../data/site'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-navy-deep border-t border-white/8">
      <div className="max-w-content mx-auto px-5 sm:px-8 lg:px-12 py-12">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">

          <div>
            <Logo />
            <p className="mt-5 text-[12.5px] leading-[1.9] text-white/60 max-w-xs">
              {SITE.tagline}
            </p>
          </div>

          <div className="sm:text-right">
            <nav className="flex flex-wrap sm:justify-end gap-x-5 gap-y-2 mb-6"
              aria-label="フッターナビゲーション">
              {NAV.map(item => (
                <a key={item.href} href={item.href}
                  className="text-[12px] text-white/65 hover:text-white
                    transition-colors">
                  {item.label}
                </a>
              ))}
            </nav>
            <a href={CONTACT.mailto}
              className="font-en text-[13px] text-white/60 hover:text-gold
                transition-colors"
              style={{ letterSpacing: '0.06em' }}>
              {CONTACT.email}
            </a>
          </div>
        </div>

        <p className="mt-12 pt-6 border-t border-white/8
          font-en text-[10.5px] text-white/55"
          style={{ letterSpacing: '0.2em' }}>
          © {new Date().getFullYear()} {SITE.nameEn}
        </p>
      </div>
    </footer>
  )
}
