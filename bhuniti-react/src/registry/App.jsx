/**
 * The wizard as a section of the BHUNITI site.
 *
 * Standalone, this subtree had its own `main.jsx` mounting a HashRouter with
 * three providers around a route table. Embedded, the site owns the router, so
 * what is left is a layout element: the providers, the registry's own chrome
 * (`components/Layout.jsx`) and an `<Outlet />` for whichever step is active.
 * The five child routes are declared in `src/App.jsx` beside every other route
 * in the app, which is that file's job.
 *
 * Being the layout element for the `/registry` branch matters: React Router
 * keeps a layout mounted while you move between its children, so wizard state
 * survives Step 1 -> Step 5 and is discarded when you leave for the rest of
 * the site — which is exactly the lifetime a draft application should have.
 */
import { useParams } from 'react-router-dom'
import { useI18n as useSiteI18n } from '../i18n'
import Layout from './components/Layout.jsx'
import { RegistryProvider } from './context/RegistryContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { I18nProvider } from './i18n/index.jsx'
import './index.css'

export default function RegistrySection() {
  // The wizard keeps its own catalogs — its 332 keys are its own vocabulary and
  // do not belong in the site's — but the *choice* of language is the visitor's
  // and has to be one choice. The site's LanguageProvider owns it; this passes
  // it down and sends the wizard's own switcher back up, so either control
  // moves both. Both catalogs cover exactly en + hi, so the value maps across
  // unchanged.
  const { locale, setLocale } = useSiteI18n()
  const { serviceType = 'sale' } = useParams()

  return (
    // theme-main scopes the colour variables, the same way MainLayout does. The
    // wizard's 52 tokens were byte-identical to this palette, so nothing in it
    // changes appearance by being embedded.
    <div className="theme-main registry-scope bg-background font-body-md text-on-surface">
      <I18nProvider locale={locale} onLocaleChange={setLocale}>
        <ToastProvider>
          <RegistryProvider key={serviceType} serviceType={serviceType}>
            <Layout />
          </RegistryProvider>
        </ToastProvider>
      </I18nProvider>
    </div>
  )
}
