import { useRegistry } from '../context/RegistryContext.jsx'
import { useI18n } from '../i18n/index.jsx'
import Icon from './Icon.jsx'

/**
 * Inline confirmation for the "Save as Draft" buttons, which were dead in the
 * original pages.
 *
 * The wrapper is always rendered. Previously the component returned `null`
 * until `draftSavedAt` existed, which meant the `role="status"` element was
 * inserted into the DOM at the same instant as its text — a live region has
 * to be present *before* the change to be announced reliably.
 *
 * The timestamp is formatted here from a stored Date, so it follows the
 * active language. The context used to store a pre-formatted string built
 * with `toLocaleTimeString([], …)`, which asks for the browser's locale
 * rather than the app's.
 */
export default function DraftSavedNote({ className = '' }) {
  const { registry } = useRegistry()
  const { t, formatTime } = useI18n()

  return (
    <span
      aria-label={t('draft.regionLabel')}
      aria-live="polite"
      className={`flex items-center gap-1.5 text-body-sm font-body-sm text-status-success ${className}`}
      role="status"
    >
      {registry.draftSavedAt ? (
        <>
          <Icon className="text-[16px]" name="cloud_done" />
          {t('draft.saved', { time: formatTime(registry.draftSavedAt) })}
        </>
      ) : null}
    </span>
  )
}
