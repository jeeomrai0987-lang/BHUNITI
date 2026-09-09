import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import { useI18n } from '../i18n/index.jsx'

/**
 * The chrome that every original page repeated byte-for-byte: fixed header +
 * breadcrumb, the `pt-[104px]` main offset, and the footer. Pages now render
 * only their own content into <Outlet />.
 */
export default function Layout() {
  const { pathname } = useLocation()
  const { t } = useI18n()

  // Fixed header + long pages means a route change otherwise keeps your old
  // scroll position halfway down the next step.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <>
      {/*
        Every page puts a fixed header, a breadcrumb and a six-step stepper
        ahead of its first form field. Without a skip link a keyboard user
        tabs through all of it on every route change.
      */}
      <a
        href="#main-content"
        className="sr-only-focusable fixed left-4 top-4 z-[1100] rounded-lg bg-primary px-4 py-2 text-white font-label-caps"
      >
        {t('app.skipToContent')}
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="w-full pt-[104px] min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
