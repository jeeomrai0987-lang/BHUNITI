import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { useRegistry } from '../context/RegistryContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useI18n } from '../i18n/index.jsx'
import { registryServicePath } from '../routes.js'

const CAPS = 'font-label-caps text-label-caps text-on-surface-variant uppercase'

const CONTEXT_IMAGE =
  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCX98tZVwBBH_ZPDblWHvJbt4onliYYItLsxK9Tb1rZB8_jxlPYNzNFosPCmupL9cqP6QyUynGK4rO7NTqCMFdBcePgt57nJKddy47yMkp-45AWFoe8OUa9ezuNRRwf3hibHoAIml16oGlUqh8bxG6bt2xlenWW0DVkS5v6NA66I8fjGc7uazDA63mevd4uEsItl28m-HE8Y1kMcSQRnuX7tyvo_TaLg_v14DMmB477YZF3QNWsEVs')"

/** The citizen ID shown beside the submitting entity — was inline in the label. */
const CITIZEN_ID = '9421'

/** How many days after submission the verification step is expected to finish. */
const VERIFICATION_LEAD_DAYS = 2

/** Stages 3–5, as icon plus catalog key rather than English prose. */
const PENDING_STAGES = [
  { icon: 'description', key: 'ro' },
  { icon: 'compare_arrows', key: 'spatial' },
  { icon: 'verified', key: 'final' },
]

/**
 * The two historical applications in the sidebar. Their dates were the strings
 * '14 Aug 2026' and '12 Nov 2025', which no formatter could reach; they are
 * `Date`s now and are formatted in the active locale.
 */
const RECENT = [
  {
    id: 'BR-2026-M19P8Q',
    statusKey: 'status.roReview',
    statusClass: 'bg-status-warning/10 text-status-warning border-status-warning/20',
    parcelKey: 'firstParcel',
    date: new Date(2026, 7, 14),
    className: 'border-border-subtle hover:border-outline-variant',
  },
  {
    id: 'BR-2025-Z99K21',
    statusKey: 'status.approved',
    statusIcon: 'done_all',
    statusClass: 'bg-status-success/10 text-status-success border-status-success/20',
    parcelKey: 'secondParcel',
    date: new Date(2025, 10, 12),
    className: 'border-border-subtle hover:border-outline-variant opacity-75',
  },
]

const addDays = (date, days) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

/** After submission — was "Registry Tracking/RegistryTracking.html". */
export default function RegistryTracking() {
  const navigate = useNavigate()
  const { registry } = useRegistry()
  const { applicationId, submitted, submittedAt, parcel } = registry
  const { t, formatDate, formatDateShort, formatDateTime, formatTime } = useI18n()
  const { notify } = useToast()
  const k = (key, vars) => t(`pages.tracking.${key}`, vars)

  const [copied, setCopied] = useState(false)
  const [refreshedAt, setRefreshedAt] = useState(null)

  // Was the global copyToClipboard() reading innerText out of the DOM. A
  // failure used to be swallowed entirely, so on a browser that refuses
  // clipboard access nothing happened and nothing said why.
  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(applicationId)
      setCopied(true)
      notify(k('copied'))
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
      notify(k('copyFailed'))
    }
  }

  /*
    The original rendered the success card unconditionally. Reaching this page
    from the header navigation without ever submitting therefore announced
    "Digital Registry Submitted Successfully" over an application that did not
    exist, and offered an acknowledgement to print.
  */
  if (!submitted) {
    return (
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col items-center text-center gap-6">
        <div
          aria-hidden="true"
          className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center"
        >
          <Icon className="text-[40px] text-on-surface-variant" name="hourglass_empty" />
        </div>
        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest bg-surface-container-high px-3 py-1 rounded-full">
          {k('empty.badge')}
        </span>
        <h1 className="font-display text-display text-on-surface tracking-tight">
          {k('empty.title')}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
          {k('empty.body')}
        </p>
        <button
          className="bg-primary text-on-primary font-body-md text-body-md font-semibold px-6 py-3 rounded flex items-center gap-2 hover:bg-secondary transition-colors shadow-sm"
          onClick={() => navigate(registryServicePath(registry.serviceType, 'review'))}
          type="button"
        >
          {k('empty.action')}
          <Icon className="text-[20px]" name="arrow_forward" />
        </button>
      </div>
    )
  }

  const expectedDate = addDays(submittedAt, VERIFICATION_LEAD_DAYS)

  return (
    <div className="flex flex-col w-full relative">
      {/* Ambient rotating geometry — decorative, and named as such. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-30"
      >
        <svg
          className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] text-surface-container-high/50"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 100 100"
        >
          <g className="origin-center animate-slowSpin">
            <circle
              cx="50"
              cy="50"
              fill="none"
              r="45"
              stroke="currentColor"
              strokeDasharray="2 4"
              strokeWidth="0.5"
            />
            <circle
              className="origin-center animate-pulseScale"
              cx="50"
              cy="50"
              fill="none"
              r="35"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M 50 10 L 90 50 L 50 90 L 10 50 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <path
              d="M 21.7 21.7 L 78.3 78.3 M 21.7 78.3 L 78.3 21.7"
              stroke="currentColor"
              strokeDasharray="4 4"
              strokeWidth="0.5"
            />
          </g>
        </svg>
      </div>

      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 z-10 relative">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="xl:col-span-8 flex flex-col gap-10">
            {/* ---------------- success header ---------------- */}
            <div className="bg-surface-white rounded-xl p-8 md:p-12 shadow-md relative overflow-hidden group">
              <div aria-hidden="true" className="absolute top-0 left-0 w-full h-1 bg-status-success" />

              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div aria-hidden="true" className="flex-shrink-0 relative">
                  <div className="w-24 h-24 bg-status-success/10 rounded-full flex items-center justify-center relative z-10">
                    <Icon className="text-[48px] text-status-success" name="check_circle" />
                  </div>
                  <div
                    className="absolute inset-0 bg-status-success/20 rounded-full animate-ping opacity-75"
                    style={{ animationDuration: '3s' }}
                  />
                </div>

                <div className="text-center md:text-left flex-1 min-w-0">
                  <div className="mb-2">
                    <span className="font-label-caps text-label-caps text-status-success uppercase tracking-widest bg-status-success/10 px-3 py-1 rounded-full">
                      {k('badge')}
                    </span>
                  </div>
                  <h1 className="font-display text-display text-on-surface mb-4 tracking-tight">
                    {k('title')}
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-8">
                    {k('lede')}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-container-low p-6 rounded-lg text-left">
                    <div className="flex flex-col gap-1">
                      <span className={CAPS}>{k('refIdLabel')}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-tabular-nums text-tabular-nums font-semibold transition-colors ${
                            copied ? 'text-status-success' : 'text-primary'
                          }`}
                        >
                          {applicationId}
                        </span>
                        {/* `title="Copy ID"` was the button's only name, and a
                            title attribute is not an accessible name. */}
                        <button
                          aria-label={k('copyId')}
                          className="text-on-surface-variant hover:text-secondary transition-colors"
                          onClick={copyId}
                          type="button"
                        >
                          <Icon
                            className="text-[18px]"
                            name={copied ? 'check' : 'content_copy'}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className={CAPS}>{k('submittedLabel')}</span>
                      <span className="font-tabular-nums text-tabular-nums font-semibold text-primary">
                        {/* Was the raw context value, seeded as a pre-formatted
                            English string. Now a Date, formatted per locale. */}
                        {formatDateTime(submittedAt)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className={CAPS}>{k('entityLabel')}</span>
                      <span className="font-body-md text-body-md font-semibold text-primary">
                        {k('entityValue', { name: k('entityName'), id: CITIZEN_ID })}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className={CAPS}>{k('parcelLabel')}</span>
                      <span className="font-tabular-nums text-tabular-nums font-semibold text-primary">
                        {parcel.ulpin}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                    {/* Labelled "Download Acknowledgement" but calls
                        window.print(), which opens a print dialog. */}
                    <button
                      className="bg-primary text-on-primary font-body-md text-body-md font-semibold px-6 py-3 rounded flex items-center gap-2 hover:bg-secondary transition-colors shadow-sm"
                      onClick={() => window.print()}
                      type="button"
                    >
                      <Icon className="text-[20px]" name="print" />
                      {k('print')}
                    </button>
                    <button
                      className="bg-surface-white border border-border-subtle text-on-surface font-body-md text-body-md font-semibold px-6 py-3 rounded flex items-center gap-2 hover:bg-surface-container-low hover:text-secondary transition-all shadow-sm group"
                      onClick={() => navigate(registryServicePath(registry.serviceType, 'parcel'))}
                      type="button"
                    >
                      <Icon
                        className="text-[20px] text-secondary group-hover:scale-110 transition-transform"
                        name="map"
                      />
                      {k('viewGis')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- tracking timeline ---------------- */}
            <div className="bg-surface-white rounded-xl shadow-md p-8 md:p-12 relative">
              <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">
                    {k('timeline.heading')}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    {k('timeline.subheading', { id: applicationId })}
                  </p>
                </div>
                {/* Was toLocaleTimeString([], …) — an empty locale list asks for
                    the browser's locale rather than the app's. */}
                <button
                  className="text-secondary font-body-sm text-body-sm font-semibold flex items-center gap-1 hover:underline"
                  onClick={() => setRefreshedAt(new Date())}
                  type="button"
                >
                  <Icon className="text-[18px]" name="refresh" />
                  {refreshedAt
                    ? k('timeline.refreshed', { time: formatTime(refreshedAt) })
                    : t('actions.refresh')}
                </button>
              </div>

              <div className="relative pl-6 md:pl-8 py-4">
                <div
                  aria-hidden="true"
                  className="absolute left-[39px] md:left-[47px] top-6 bottom-6 w-0.5 bg-surface-container-highest"
                />
                <div
                  aria-hidden="true"
                  className="absolute left-[39px] md:left-[47px] top-6 h-[20%] w-0.5 bg-status-success shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                />

                <ol className="flex flex-col gap-10 list-none m-0 p-0">
                  {/* Stage 1 — complete */}
                  <li className="relative flex items-start gap-6 group">
                    <div
                      aria-hidden="true"
                      className="absolute -left-6 md:-left-8 flex h-full items-center justify-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-status-success flex items-center justify-center z-10 shadow-sm">
                        <Icon className="text-[16px] text-surface-white" fill name="check" />
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-5 rounded-lg border border-border-subtle flex-1 hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h3 className="font-headline-md text-headline-md text-on-surface flex flex-wrap items-center gap-2">
                          {k('timeline.submittedTitle')}
                          <span className="bg-status-success/10 text-status-success font-label-caps text-label-caps px-2 py-0.5 rounded uppercase tracking-wide">
                            {t('status.complete')}
                          </span>
                        </h3>
                        <span className="font-tabular-nums text-tabular-nums text-on-surface-variant">
                          {formatDateTime(submittedAt)}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        {k('timeline.submittedBody')}
                      </p>
                    </div>
                  </li>

                  {/* Stage 2 — in progress */}
                  <li className="relative flex items-start gap-6 group">
                    <div
                      aria-hidden="true"
                      className="absolute -left-6 md:-left-8 flex h-full items-start pt-4 justify-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-surface-white border-2 border-secondary flex items-center justify-center z-10 shadow-[0_0_12px_rgba(0,88,190,0.3)]">
                        <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div className="bg-secondary/5 p-5 rounded-lg border border-secondary/20 flex-1 relative overflow-hidden">
                      <div
                        aria-hidden="true"
                        className="absolute right-0 top-0 w-32 h-32 bg-secondary opacity-5 blur-3xl rounded-full"
                      />
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 relative z-10">
                        <h3 className="font-headline-md text-headline-md text-secondary">
                          {k('timeline.verificationTitle')}
                        </h3>
                        <span className="font-tabular-nums text-tabular-nums text-on-surface-variant">
                          {/* Derived from the submission date instead of the
                              hard-coded '02 Sep 2026'. */}
                          {k('timeline.verificationExpected', {
                            date: formatDate(expectedDate),
                          })}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant relative z-10">
                        {k('timeline.verificationBody')}
                      </p>
                      <div className="mt-4 pt-4 border-t border-secondary/10 flex items-center gap-4 relative z-10">
                        <div
                          aria-hidden="true"
                          className="flex-1 bg-surface-container-high h-1.5 rounded-full overflow-hidden"
                        >
                          <div className="bg-secondary h-full rounded-full animate-loadProgress" />
                        </div>
                        <span className="font-tabular-nums text-tabular-nums text-secondary font-semibold text-xs">
                          {t('status.inProgress')}
                        </span>
                      </div>
                    </div>
                  </li>

                  {/* Stages 3–5 — pending */}
                  {PENDING_STAGES.map((stage) => (
                    <li className="relative flex items-start gap-6 opacity-60" key={stage.key}>
                      <div
                        aria-hidden="true"
                        className="absolute -left-6 md:-left-8 flex h-full items-start pt-4 justify-center"
                      >
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center z-10 border border-outline-variant">
                          <Icon className="text-[18px] text-outline" name={stage.icon} />
                        </div>
                      </div>
                      <div className="bg-surface-white p-5 rounded-lg border border-outline-variant/30 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h3 className="font-headline-md text-headline-md text-on-surface-variant">
                            {k(`timeline.${stage.key}Title`)}
                          </h3>
                          <span className="font-label-caps text-label-caps text-outline uppercase">
                            {t('status.pending')}
                          </span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          {k(`timeline.${stage.key}Body`)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* ---------------- sidebar ---------------- */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-white rounded-xl shadow-sm p-6 border border-border-subtle">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-subtle">
                <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                  <Icon className="text-secondary" name="folder_special" />
                  {k('recent.heading')}
                </h3>
                <button
                  className="text-body-sm font-body-sm text-secondary font-semibold hover:underline"
                  onClick={() => navigate(registryServicePath(registry.serviceType, 'parcel'))}
                  type="button"
                >
                  {t('actions.viewAll')}
                </button>
              </div>

              <ul
                aria-label={k('recent.listLabel')}
                className="flex flex-col gap-4 list-none m-0 p-0"
              >
                {/* The application just submitted in this session */}
                <li>
                  <button
                    className="group bg-surface-container-lowest p-4 rounded-lg border border-secondary/30 relative overflow-hidden transition-all hover:shadow-md text-left w-full"
                    onClick={() => navigate(registryServicePath(registry.serviceType, 'review'))}
                    type="button"
                  >
                    <div aria-hidden="true" className="absolute top-0 left-0 w-1 h-full bg-secondary" />
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="font-tabular-nums text-tabular-nums font-semibold text-on-surface">
                        {applicationId}
                      </span>
                      <span className="bg-secondary/10 text-secondary font-label-caps text-label-caps px-2 py-0.5 rounded border border-secondary/20 shrink-0">
                        {t('status.underVerification')}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 line-clamp-1">
                      {k('recent.currentParcel', {
                        ulpin: parcel.ulpin,
                        village: parcel.village,
                      })}
                    </p>
                    <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant opacity-80">
                      <span>{formatDateShort(submittedAt)}</span>
                      <Icon
                        className="text-[16px] group-hover:translate-x-1 transition-transform"
                        name="arrow_forward"
                      />
                    </div>
                  </button>
                </li>

                {/*
                  These two were inert <div>s carrying a hover-sliding arrow —
                  the visual language of a link with nothing behind it. They
                  open the parcel view now, so the arrow tells the truth.
                */}
                {RECENT.map((item) => (
                  <li key={item.id}>
                    <button
                      className={`group bg-surface-container-lowest p-4 rounded-lg border relative overflow-hidden transition-all hover:shadow-md text-left w-full ${item.className}`}
                      onClick={() => navigate(registryServicePath(registry.serviceType, 'parcel'))}
                      type="button"
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="font-tabular-nums text-tabular-nums font-semibold text-on-surface">
                          {item.id}
                        </span>
                        <span
                          className={`font-label-caps text-label-caps px-2 py-0.5 rounded border flex items-center gap-1 shrink-0 ${item.statusClass}`}
                        >
                          {item.statusIcon && (
                            <Icon className="text-[12px]" name={item.statusIcon} />
                          )}
                          {t(item.statusKey)}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 line-clamp-1">
                        {k(`recent.${item.parcelKey}`)}
                      </p>
                      <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant opacity-80">
                        <span>{formatDateShort(item.date)}</span>
                        <Icon
                          className="text-[16px] group-hover:translate-x-1 transition-transform"
                          name="arrow_forward"
                        />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual context panel */}
            <div className="bg-surface-white rounded-xl shadow-sm border border-border-subtle overflow-hidden hidden md:block">
              <div
                aria-hidden="true"
                className="bg-cover bg-center w-full h-48 opacity-90 mix-blend-multiply"
                style={{ backgroundImage: CONTEXT_IMAGE }}
              />
              <div className="p-4 bg-primary-container text-on-primary-container">
                <div className="flex items-start gap-3">
                  <Icon className="text-secondary" name="info" />
                  <p className="font-body-sm text-body-sm">{k('contextBody')}</p>
                </div>
              </div>
            </div>

            <button
              className="flex items-center justify-center gap-2 text-on-surface-variant hover:text-secondary text-body-sm font-body-sm transition-colors"
              onClick={() => navigate(registryServicePath(registry.serviceType, 'parcel'))}
              type="button"
            >
              <Icon className="text-[18px]" name="restart_alt" />
              {k('startNew')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
