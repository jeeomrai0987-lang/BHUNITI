import { useI18n } from '../i18n/index.jsx'
import { useDemoNotice } from '../context/ToastContext.jsx'

const LOGO_SRC =
  'https://lh3.googleusercontent.com/aida/AEtjO1ViTYD5wkQF_D3bDpgOy-0_0UX5kP7rKnX2Gh_mB1BrZGZc72cJqw3vEOHpSgUNajXshp6znUMYqQw546f-5h-fZyrBJUOGCUzdtm-idIx8GN3g_QbaxoVoCdsLJ9W40ZFc4qztOJob-FF3wJHIch4bBZ0wBJLlTzdwkYE1mkA3GT9iJbJj18vmylDHxu2NmhXuc3Rh7EhW28Mvth75yyh-XNTUDgdr_AY4UqlCgToGlG7peQZoyNWA_Q'

const LINK_CLASS =
  'text-body-sm font-body-sm text-on-surface-variant hover:text-primary transition-colors text-left'

/**
 * Identical footer that was duplicated verbatim across all five pages.
 *
 * All six links were `<a href="#">`, which jumps to the top of the page and
 * reads as a link to a screen reader. They are now buttons that say the
 * destination does not exist in this prototype, the two link groups are real
 * lists under real headings, and the copyright year is computed instead of
 * frozen at 2024 (the app's own sample data is dated 2026).
 */
export default function Footer() {
  const { t } = useI18n()
  const demoNotice = useDemoNotice()

  const groups = [
    {
      heading: t('footer.legalHeading'),
      items: [t('footer.security'), t('footer.privacy'), t('footer.terms')],
    },
    {
      heading: t('footer.resourcesHeading'),
      items: [t('footer.faq'), t('footer.manuals'), t('footer.support')],
    },
  ]

  return (
    <footer
      aria-label={t('footer.linksLabel')}
      className="w-full bg-surface-container-high py-12 mt-12 border-t border-outline-variant"
    >
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-4">
              {/* Decorative: the wordmark next to it carries the name. */}
              <img alt="" className="h-6 w-auto grayscale opacity-70" src={LOGO_SRC} />
              <span className="font-headline-md text-on-surface-variant opacity-70">
                {t('app.brand')}
              </span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant mb-4">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Two groups, so two columns. The original asked for three and left
              the last one empty, pushing the pair off-centre on desktop. */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-12">
            {groups.map((group) => (
              <div className="flex flex-col gap-3" key={group.heading}>
                <h2 className="text-label-caps font-label-caps text-on-surface m-0">
                  {group.heading}
                </h2>
                <ul className="flex flex-col gap-3 list-none m-0 p-0">
                  {group.items.map((label) => (
                    <li key={label}>
                      <button
                        className={LINK_CLASS}
                        onClick={() => demoNotice(label)}
                        type="button"
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-body-sm font-body-sm text-on-surface-variant">
              {t('footer.attributionLabel')}
            </span>
            <span className="text-body-sm font-body-sm font-semibold text-on-surface">
              {t('footer.attributionValue')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
