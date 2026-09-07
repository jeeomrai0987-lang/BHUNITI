import { useState } from 'react'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import Icon from './Icon.jsx'
import { PATHS, PATH_LABEL_KEYS, SITE_HOME, serviceNavLinks } from '../routes.js'
import { useI18n, LOCALES, LOCALE_NAMES } from '../i18n/index.jsx'
import { useDemoNotice } from '../context/ToastContext.jsx'

const LOGO_SRC =
  'https://lh3.googleusercontent.com/aida/AEtjO1ViTYD5wkQF_D3bDpgOy-0_0UX5kP7rKnX2Gh_mB1BrZGZc72cJqw3vEOHpSgUNajXshp6znUMYqQw546f-5h-fZyrBJUOGCUzdtm-idIx8GN3g_QbaxoVoCdsLJ9W40ZFc4qztOJob-FF3wJHIch4bBZ0wBJLlTzdwkYE1mkA3GT9iJbJj18vmylDHxu2NmhXuc3Rh7EhW28Mvth75yyh-XNTUDgdr_AY4UqlCgToGlG7peQZoyNWA_Q'

const AVATAR_SRC =
  'https://lh3.googleusercontent.com/aida/AEtjO1U8ehrOV019TWttUF3LtTD84ZcfNN844RAjVktZOCV5K3FzAI_K2b4WOHxxcMf8BVS6yLBDe-hx67dJzmana3nrxKbdHKFu9Gcd2fi1VlX8d344Jn1NNq1D7EDoz21Ls4xlRcQZ6adAqopr6C7R2h1jh6B8VlUyBMYey5H8Wv2yKq21MPDYxtkfMWNclO_A9ONulOr7crrnZv8QQ6e5oO6rLLtGEO6FYTrVVd0Kt3cUyUM3loYguN4d0Q'

/** Active vs idle nav-link classes, lifted from the original markup. */
const navClass = ({ isActive }) =>
  isActive
    ? 'text-body-md transition-colors text-secondary font-semibold border-b-2 border-secondary'
    : 'text-body-md text-on-surface-variant hover:text-secondary transition-colors'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, locale, setLocale } = useI18n()
  const { pathname } = useLocation()
  const { serviceType = 'sale' } = useParams()
  const navLinks = serviceNavLinks(serviceType)
  const currentSegment = pathname.split('/').filter(Boolean).pop()
  const currentLabelKey = PATH_LABEL_KEYS[currentSegment] ?? 'header.breadcrumbSection'
  const demoNotice = useDemoNotice()

  // The original header carried `const [lang, setLang] = useState('en')`.
  // The two buttons wrote to it and nothing anywhere read it back, so the
  // language switcher the prototype advertised changed exactly nothing.
  // It now drives the real locale.

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-white/90 backdrop-blur-md border-b border-border-subtle">
      <div className="h-16 w-full px-margin-mobile md:px-margin-desktop flex items-center justify-between gap-gutter">
        <div className="flex items-center gap-6 min-w-0">
          {/* Hamburger — the original had no mobile nav at all */}
          <button
            aria-controls="mobile-nav"
            aria-expanded={menuOpen}
            aria-label={t('nav.toggle')}
            className="lg:hidden text-on-surface-variant hover:text-primary shrink-0"
            onClick={() => setMenuOpen((o) => !o)}
            type="button"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>

          {/*
            Standalone this pointed at the wizard's own first step, because
            there was nowhere else to go. The wizard is now a section of the
            site, so the brand does what a brand always does and goes home.
          */}
          <NavLink className="flex items-center gap-3 shrink-0" to={SITE_HOME}>
            {/*
              alt="" because the wordmark beside it already says BHUNITI —
              the original alt="BHUNITI logo" made a screen reader read the
              brand twice.
            */}
            <img alt="" className="h-8 w-auto object-contain" src={LOGO_SRC} />
            <span className="font-headline-md text-headline-md text-primary tracking-tight">
              {t('app.brand')}
            </span>
          </NavLink>

          <nav aria-label={t('nav.label')} className="hidden lg:flex items-center gap-8 h-16">
            {navLinks.map((link) => (
              <NavLink className={navClass} key={link.to} to={link.to}>
                {t(link.labelKey)}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div
            aria-label={t('header.languageGroup')}
            className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-lg border border-outline-variant"
            role="group"
          >
            {LOCALES.map((code, i) => (
              <span className="flex items-center gap-2" key={code}>
                {i > 0 && (
                  <span aria-hidden="true" className="text-outline-variant">
                    |
                  </span>
                )}
                <button
                  aria-pressed={locale === code}
                  className={`text-label-caps font-label-caps cursor-pointer hover:text-primary ${
                    locale === code ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}
                  lang={code}
                  onClick={() => setLocale(code)}
                  type="button"
                >
                  {LOCALE_NAMES[code]}
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              aria-label={t('header.notifications')}
              className="text-on-surface-variant hover:text-primary"
              onClick={() => demoNotice(t('header.notifications'))}
              type="button"
            >
              <Icon name="notifications" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
              <div className="text-right hidden sm:block">
                <p className="text-body-sm font-body-sm font-bold text-on-surface">
                  {t('header.userName')}
                </p>
                <p className="text-label-caps font-label-caps text-on-surface-variant">
                  {t('header.userId', { id: '9421' })}
                </p>
              </div>
              {/* Decorative: the name is already visible next to it. */}
              <img
                alt=""
                aria-hidden="true"
                className="w-8 h-8 rounded-full object-cover border border-outline-variant"
                src={AVATAR_SRC}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <nav
          aria-label={t('nav.label')}
          className="lg:hidden bg-surface-white border-b border-border-subtle px-margin-mobile py-2 flex flex-col"
          id="mobile-nav"
        >
          {navLinks.map((link) => (
            <NavLink
              className={({ isActive }) =>
                `py-3 text-body-md ${
                  isActive
                    ? 'text-secondary font-semibold'
                    : 'text-on-surface-variant hover:text-secondary'
                }`
              }
              key={link.to}
              onClick={() => setMenuOpen(false)}
              to={link.to}
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
        </nav>
      )}

      {/*
        Breadcrumb. Originally a bare <div> whose leaf always read "Digital
        Registry" no matter which of the five pages you were on, with "Home"
        and "Citizen Services" both linking to the same route. It is now a
        real nav/ol and the leaf follows the route.

        Embedded, the trail finally describes something true: "Home" is the
        site's front page and "Digital Registry" is this section's own first
        step, so both crumbs are links that go where they say.
      */}
      <nav
        aria-label={t('header.breadcrumbLabel')}
        className="bg-surface-container-lowest border-b border-border-subtle px-margin-mobile md:px-margin-desktop py-2"
      >
        <ol className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant list-none m-0 p-0">
          <li>
            <NavLink className="hover:text-secondary cursor-pointer" to={SITE_HOME}>
              {t('header.breadcrumbHome')}
            </NavLink>
          </li>
          <li aria-hidden="true" className="flex items-center">
            <Icon className="text-[16px]" name="chevron_right" />
          </li>
          <li>
            <NavLink className="hover:text-secondary cursor-pointer" end to={serviceNavLinks(serviceType)[0].to}>
              {t('header.breadcrumbSection')}
            </NavLink>
          </li>
          <li aria-hidden="true" className="flex items-center">
            <Icon className="text-[16px]" name="chevron_right" />
          </li>
          <li aria-current="page" className="text-on-surface font-semibold">
            {t(currentLabelKey)}
          </li>
        </ol>
      </nav>
    </header>
  )
}
