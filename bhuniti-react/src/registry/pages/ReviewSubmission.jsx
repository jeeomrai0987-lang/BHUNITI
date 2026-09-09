import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import DraftSavedNote from '../components/DraftSavedNote.jsx'
import { orSample, useRegistry } from '../context/RegistryContext.jsx'
import { useI18n } from '../i18n/index.jsx'
import { feeBreakdown, parcelAreaHectares } from '../lib/fees.js'
import { registryServicePath, TOTAL_STEPS, WIZARD_STEPS } from '../routes.js'

const LABEL = 'text-label-caps font-label-caps text-on-surface-variant'

/**
 * Remote imagery, kept as in the original. The mini-map is a background
 * image on a button whose visible caption already names it; the two avatars
 * sit directly beside the person's name, so both take `alt=""` rather than
 * repeating what is already on screen.
 */
const MINI_MAP =
  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOpV9WiowTAkBhveaovzgBC_iC0oA9bFe4lAeZQqefbzoeRtbNbDhtRL0WiNIdtFAUyj8l3WBQSqusTyuvv1gZkEj-5rz0iWICu6DT18540-noULPQIKnu8hYeVKEPX8g0CO2QsF2c6TOCVdf9oz7yxcjlFfvzBePJuFI0hCQegEA6yl6TmQiLaSpeuT1gnJqEkepM1tmhLoF6YqDNFY6HFFFXpaNtmYyAx2YLnPuDL7Wt9xjR_yk')"

const SELLER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAsXtRygU0KGLnB4Y1PwtFd3TXLJjSHrnQv5CrFrttteFbqHZI9Yj3OFCgcvqaTGO7NCZUenYpT-lJdHi3Jp-6SgS96ow6GjZEWnwcY6_-Iljl4Nv2u_ybl653cAovqvaxImREOv4Eoi-79dm7SFI8P1RFrzlSW8u1qYRojf3r9X3JNpYYtYh4ZOxUs7OvCj1asqqJxMgUFf5LfFvUXwMgvqnsMuqx6_ZTPQsFB3tfWrtPpRs65v_w'

const BUYER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDqKDQy9fJnOpz6hGKt5ZIhM8GijMR8-WKkpXATkd3riutORu4TukLn6rkbXq3EjDIV_PEqTuYP4gFFLK1lNm_eSL2g0ugaeS3yT61cZuW22Yq0YncwqJBiNZ_yhGPTCjYZ5fiGU4n5gYLnsWDVl8AYF7n6n_f0t-apGVvP5sGbUUqR8iRCeaL8chnTl-iIwmm3ZzAMEQJUVYsMLBWW0jmWgTVeaBUPi_nyfxxZd6mA7iP1ExUscps'

/** Government receipt number for the demo payment — was inline in the label. */
const GRN = 'MH009214'

const SELLER_AADHAAR = 'XXXX-XXXX-4921'
const BUYER_SAMPLE_AADHAAR = 'XXXX-XXXX-8832'

/** The three reconciliation rows, as key pairs rather than English prose. */
const RECONCILIATION = [
  ['ulpinTitle', 'ulpinDetail'],
  ['rorTitle', 'rorDetail'],
  ['encumbranceTitle', 'encumbranceDetail'],
]

/**
 * The three annexures. Sizes were welded into the meta strings
 * ("2.4 MB • Digitally Signed"), so neither the number nor the unit could be
 * localised; they are now a value plus a unit key.
 */
const DOCUMENTS = [
  { key: 'deed', size: 2.4, unit: 'units.mb' },
  { key: 'extract', size: 1.1, unit: 'units.mb' },
  { key: 'noc', size: 800, unit: 'units.kb' },
]

/** Steps 5 & 6 of 6 — was "review & submission/ReviewSubmission.html". */
export default function ReviewSubmission() {
  const navigate = useNavigate()
  const { registry, set, saveDraft, submit } = useRegistry()
  const { parcel, transferee, transaction, declarationAccepted } = registry
  const { t, tOr, tag, formatCurrency, formatDecimal, formatNumber } = useI18n()
  const r = (key, vars) => t(`pages.review.${key}`, vars)
  /** Same display-only place translation as step 1; the record is untouched. */
  const place = (name) => tOr(`pages.parcel.places.${name}`, name)

  /**
   * Every figure comes from one call, and the rates come back with it — so a
   * label can no longer say "6%" while the arithmetic uses 7%, which is
   * exactly what happened between this page and Transaction & Documents.
   */
  const fees = feeBreakdown(transaction.value)

  const percent = useMemo(
    () => new Intl.NumberFormat(tag, { style: 'percent', maximumFractionDigits: 2 }),
    [tag],
  )

  const deedType = t(`pages.transaction.types.${transaction.type || 'sale'}`)
  const purpose = t(`landUse.${transaction.purpose || parcel.landUse}`)

  const onSubmit = () => {
    submit()
    navigate(registryServicePath(registry.serviceType, 'tracking'))
  }

  return (
    <div className="flex flex-col w-full relative">
      {/* Ambient background wash from the original — purely decorative. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      >
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary-fixed/20 blur-[100px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] -right-[5%] w-[30%] h-[50%] bg-secondary-fixed/20 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop relative z-10">
        {/* ---------------- page header ---------------- */}
        <div className="flex flex-col gap-unit mt-margin-desktop mb-8">
          <div className="flex items-center gap-3">
            <span className="text-label-caps font-label-caps text-secondary tracking-widest uppercase">
              {r('eyebrow')}
            </span>
            <div aria-hidden="true" className="h-[1px] w-12 bg-outline-variant/50" />
            <span className={LABEL}>{r('stepRange')}</span>
          </div>
          <h1 className="text-display font-display text-on-surface">{r('title')}</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mt-2">
            {r('lede')}
          </p>
        </div>

        <TopStepper current={5} />

        {/* ---------------- main grid ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12">
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Parcel information — reads back step 1 */}
            <ReviewCard
              icon="landscape"
              iconClass="bg-primary-fixed text-on-primary-fixed"
              onEdit={() => navigate(registryServicePath(registry.serviceType, 'parcel'))}
              subtitle={r('parcelCard.subtitle')}
              title={r('parcelCard.title')}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <Field bold label={r('parcelCard.ulpin')} numeric value={parcel.ulpin} />
                <Field
                  label={r('parcelCard.stateDistrict')}
                  value={`${place(parcel.state)} / ${place(parcel.district)}`}
                />
                <Field
                  label={r('parcelCard.talukaVillage')}
                  value={`${place(parcel.tehsil)} / ${place(parcel.village)}`}
                />
                <Field
                  label={r('parcelCard.surveyPlot')}
                  numeric
                  value={`${parcel.surveyNo}/${parcel.plotNo}`}
                />
                {/*
                  Was the literal "0.45 Hectares" while step 1 showed
                  "0.85 Acre" — not a unit conversion of each other, just two
                  different numbers. Now converted from the one stored area.
                */}
                <Field
                  label={r('parcelCard.totalArea')}
                  numeric
                  value={`${formatDecimal(parcelAreaHectares())} ${t('units.hectare')}`}
                />
                <Field
                  label={r('parcelCard.landUse')}
                  value={r('parcelCard.landUseValue', { purpose })}
                />
              </div>

              {/*
                `title="Open the GIS map"` was the only name this button had,
                and a title attribute is not an accessible name for a control
                with visible content. The caption inside it is the name now,
                extended by a screen-reader-only phrase saying where it goes.
              */}
              <button
                className="mt-6 w-full h-32 rounded-lg overflow-hidden relative block"
                onClick={() => navigate(registryServicePath(registry.serviceType, 'parcel'))}
                type="button"
              >
                <div
                  aria-hidden="true"
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: MINI_MAP }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent flex items-end p-3">
                  <span className="text-body-sm font-body-sm text-on-surface font-medium backdrop-blur-sm bg-surface-container-lowest/50 px-2 py-1 rounded">
                    {r('parcelCard.gisVerified')}
                  </span>
                </div>
                <span className="sr-only">{r('parcelCard.gisOpen')}</span>
              </button>
            </ReviewCard>

            {/* Parties involved — the transferee comes from step 2 */}
            <ReviewCard
              icon="group"
              iconClass="bg-secondary-fixed text-on-secondary-fixed"
              onEdit={() => navigate(registryServicePath(registry.serviceType, 'owner'))}
              subtitle={r('partiesCard.subtitle')}
              title={r('partiesCard.title')}
            >
              <div className="flex flex-col gap-4">
                <Party
                  aadhaar={SELLER_AADHAAR}
                  avatar={SELLER_AVATAR}
                  name={r('partiesCard.sellerName')}
                  role={r('partiesCard.executant')}
                  roleClass="bg-surface-variant text-on-surface-variant"
                />
                <Party
                  aadhaar={orSample(transferee.idNumber, BUYER_SAMPLE_AADHAAR)}
                  avatar={BUYER_AVATAR}
                  name={orSample(transferee.name, r('partiesCard.buyerSampleName'))}
                  role={r('partiesCard.claimant')}
                  roleClass="bg-primary-container text-on-primary-container"
                />
              </div>
            </ReviewCard>

            {/* Transaction & fees — every figure derives from step 3 */}
            <ReviewCard
              icon="payments"
              iconClass="bg-tertiary-fixed text-on-tertiary-fixed"
              onEdit={() => navigate(registryServicePath(registry.serviceType, 'transaction'))}
              subtitle={r('feesCard.subtitle')}
              title={r('feesCard.title')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <Row
                    label={r('feesCard.deedType')}
                    value={r('feesCard.deedTypeValue', { deed: deedType, purpose })}
                  />
                  <Row
                    label={r('feesCard.consideration')}
                    value={formatCurrency(fees.consideration)}
                  />
                  <Row
                    label={r('feesCard.marketValue')}
                    value={formatCurrency(fees.marketValue)}
                  />
                </div>

                <div className="bg-surface-container-low rounded-lg p-4 flex flex-col gap-3">
                  <span className={`${LABEL} mb-2`}>{r('feesCard.heading')}</span>
                  {/* The percentage in each label is derived from the rate used. */}
                  <Fee
                    label={r('feesCard.stampDuty', {
                      rate: percent.format(fees.rates.stampDuty),
                    })}
                    value={formatCurrency(fees.stampDuty)}
                  />
                  <Fee
                    label={r('feesCard.registration', {
                      rate: percent.format(fees.rates.registration),
                    })}
                    value={formatCurrency(fees.registration)}
                  />
                  <Fee
                    label={r('feesCard.cess', { rate: percent.format(fees.rates.cess) })}
                    value={formatCurrency(fees.cess)}
                  />
                  <div aria-hidden="true" className="w-full h-[1px] bg-outline-variant/50 my-1" />
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-body-md font-body-md text-on-surface font-bold">
                      {r('feesCard.total')}
                    </span>
                    <span className="text-headline-md font-tabular-nums text-secondary font-bold">
                      {formatCurrency(fees.total)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-status-success">
                    <Icon className="text-[16px]" name="check_circle" />
                    <span className="text-body-sm font-body-sm">
                      {r('feesCard.paymentVerified', { grn: GRN })}
                    </span>
                  </div>
                </div>
              </div>
            </ReviewCard>

            {/* Uploaded documents — Edit jumps back to step 4 */}
            <ReviewCard
              icon="description"
              iconClass="bg-surface-variant text-on-surface-variant"
              onEdit={() => navigate(registryServicePath(registry.serviceType, 'transaction'))}
              subtitle={r('documentsCard.subtitle')}
              title={r('documentsCard.title')}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DOCUMENTS.map((doc) => {
                  const name = r(`documentsCard.${doc.key}Name`)
                  const amount = Number.isInteger(doc.size)
                    ? formatNumber(doc.size)
                    : formatDecimal(doc.size)
                  const size = `${amount} ${t(doc.unit)}`
                  return (
                    <div
                      className="flex items-center gap-3 p-3 bg-surface-container-lowest border border-outline-variant/50 rounded-lg"
                      key={doc.key}
                    >
                      <div
                        aria-hidden="true"
                        className="w-8 h-8 rounded bg-status-error/10 text-status-error flex items-center justify-center shrink-0"
                      >
                        <Icon className="text-[18px]" name="picture_as_pdf" />
                      </div>
                      <div className="flex flex-col flex-grow overflow-hidden">
                        <span className="text-body-sm font-body-sm text-on-surface truncate">
                          {name}
                        </span>
                        <span className="text-[10px] font-tabular-nums text-on-surface-variant">
                          {r(`documentsCard.${doc.key}Meta`, { size })}
                        </span>
                      </div>
                      <button
                        aria-label={`${t('actions.preview')} — ${name}`}
                        className="text-on-surface-variant hover:text-secondary shrink-0"
                        onClick={() => navigate(registryServicePath(registry.serviceType, 'transaction'))}
                        type="button"
                      >
                        <Icon className="text-[18px]" name="visibility" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </ReviewCard>
          </div>

          {/* ---------------- right: reconciliation + actions ---------------- */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-[120px]">
            <div className="bg-primary-container text-on-primary-container rounded-xl shadow-lg p-6 relative overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"
              />

              <div className="flex items-center gap-2 mb-6 relative z-10">
                <Icon className="text-secondary-fixed" name="hub" />
                <h3 className="text-body-lg font-headline-md text-on-primary-fixed">
                  {r('reconciliation.title')}
                </h3>
              </div>

              <ul className="flex flex-col gap-4 relative z-10 list-none m-0 p-0">
                {RECONCILIATION.map(([titleKey, detailKey]) => (
                  <li className="flex items-start gap-3" key={titleKey}>
                    <div
                      aria-hidden="true"
                      className="w-5 h-5 rounded-full bg-status-success flex items-center justify-center shrink-0 mt-0.5"
                    >
                      <Icon
                        className="text-[14px] text-surface-container-lowest font-bold"
                        name="check"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-body-sm font-body-sm text-on-primary-fixed font-medium">
                        {r(`reconciliation.${titleKey}`)}
                      </span>
                      <span className="text-[11px] font-body-sm text-primary-fixed-dim">
                        {r(`reconciliation.${detailKey}`)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-outline/30 relative z-10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-label-caps font-label-caps text-primary-fixed-dim">
                    {r('reconciliation.systemStatusLabel')}
                  </span>
                  <span className="text-body-md font-body-md text-on-primary-fixed font-semibold">
                    {r('reconciliation.systemStatusValue')}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container-lowest/10 flex items-center justify-center backdrop-blur-sm">
                  {/* An unlabelled <svg> is announced as nothing; give it a name. */}
                  <svg
                    aria-label={r('reconciliation.systemStatusIcon')}
                    className="w-6 h-6 text-status-success animate-pulse"
                    fill="none"
                    role="img"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submission actions — the checkbox now genuinely gates the button */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <input
                  checked={declarationAccepted}
                  className="peer w-5 h-5 mt-1 shrink-0 accent-secondary cursor-pointer"
                  id="accuracy-check"
                  onChange={(e) => set('declarationAccepted', e.target.checked)}
                  type="checkbox"
                />
                <label
                  className="text-body-sm font-body-sm text-on-surface-variant cursor-pointer select-none"
                  htmlFor="accuracy-check"
                >
                  {r('declaration')}
                </label>
              </div>

              <div className="flex flex-col gap-3">
                {/*
                  The button was disabled with nothing explaining why — a
                  disabled control is skipped by the keyboard, so the reason
                  was unreachable. The hint below is referenced by
                  aria-describedby and is now visible to everyone.
                */}
                <button
                  aria-describedby={declarationAccepted ? undefined : 'submit-blocked'}
                  className={`w-full bg-secondary text-on-secondary py-3 rounded-lg text-body-md font-headline-md shadow-md transition-colors flex justify-center items-center gap-2 group ${
                    declarationAccepted
                      ? 'hover:bg-on-secondary-fixed-variant'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!declarationAccepted}
                  onClick={onSubmit}
                  type="button"
                >
                  {r('submitButton')}
                  <Icon
                    className="text-[20px] group-hover:translate-x-1 transition-transform"
                    name="arrow_forward"
                  />
                </button>

                {!declarationAccepted && (
                  <p
                    className="text-body-sm font-body-sm text-on-surface-variant text-center"
                    id="submit-blocked"
                  >
                    {r('submitBlocked')}
                  </p>
                )}

                <button
                  className="w-full bg-surface-container-lowest border border-outline text-on-surface py-3 rounded-lg text-body-md font-headline-md hover:bg-surface-container-low transition-colors"
                  onClick={saveDraft}
                  type="button"
                >
                  {t('actions.saveDraft')}
                </button>

                <div className="flex justify-center">
                  <DraftSavedNote />
                </div>
              </div>

              <p className="text-[11px] font-body-sm text-center text-on-surface-variant">
                {r('forwardedTo')}
              </p>
            </div>

            <button
              className="flex items-center justify-center gap-2 text-on-surface-variant hover:text-secondary text-body-sm font-body-sm transition-colors"
              onClick={() => navigate(registryServicePath(registry.serviceType, 'transaction'))}
              type="button"
            >
              <Icon className="text-[18px]" name="arrow_back" />
              {r('backToTransaction')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * This page's own stepper, kept because its look differs from the one on
 * Parcel Identification — but sourced from the canonical WIZARD_STEPS.
 *
 * The local list it replaced read "Initiation / Parties / Property /
 * Documents / Review / Submit" and sent both step 1 and step 3 to the parcel
 * route, so "Property" and "Initiation" were the same destination under two
 * names.
 */
function TopStepper({ current }) {
  const navigate = useNavigate()
  const { t } = useI18n()

  return (
    <div className="w-full bg-surface-container-low p-6 rounded-xl shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center w-full relative">
        <div
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-outline-variant/30 hidden md:block"
        />
        <div
          aria-hidden="true"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[85%] h-[2px] bg-secondary hidden md:block transition-all duration-700 ease-in-out"
        />
        <ol
          aria-label={t('steps.listLabel')}
          className="flex flex-row justify-between w-full relative z-10 list-none m-0 p-0"
        >
          {WIZARD_STEPS.map((step) => {
            const state = step.n < current ? 'done' : step.n === current ? 'active' : 'todo'
            const label = t(`steps.${step.key}.short`)

            return (
              <li key={step.n}>
                <button
                  aria-current={state === 'active' ? 'step' : undefined}
                  aria-label={`${t('stepOf', { current: step.n, total: TOTAL_STEPS })} — ${label}`}
                  className="flex flex-col items-center gap-2 group"
                  onClick={() => navigate(registryServicePath(registry.serviceType, step.segment))}
                  type="button"
                >
                  {state === 'done' && (
                    <div
                      aria-hidden="true"
                      className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
                    >
                      <Icon className="text-[16px]" name="check" />
                    </div>
                  )}
                  {state === 'active' && (
                    <div
                      aria-hidden="true"
                      className="w-8 h-8 rounded-full bg-surface-container-lowest text-secondary ring-2 ring-secondary flex items-center justify-center shadow-md relative"
                    >
                      <div className="absolute -inset-1 rounded-full bg-secondary/10 animate-ping" />
                      <span className="text-body-md font-body-md font-bold">{step.n}</span>
                    </div>
                  )}
                  {state === 'todo' && (
                    <div
                      aria-hidden="true"
                      className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center opacity-50"
                    >
                      <span className="text-body-md font-body-md">{step.n}</span>
                    </div>
                  )}
                  <span
                    className={`text-label-caps font-label-caps hidden md:block ${
                      state === 'active'
                        ? 'text-secondary font-bold'
                        : state === 'done'
                          ? 'text-on-surface'
                          : 'text-on-surface-variant opacity-50'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

/** Card chrome shared by the four review sections, incl. its Edit button. */
function ReviewCard({ children, icon, iconClass, subtitle, title, onEdit }) {
  const { t } = useI18n()
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-sm p-6 group hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-wrap gap-3 justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconClass}`}
          >
            <Icon fill name={icon} />
          </div>
          <div>
            <h3 className="text-headline-md font-headline-md text-on-surface">{title}</h3>
            <p className="text-body-sm font-body-sm text-on-surface-variant">{subtitle}</p>
          </div>
        </div>
        {/* "Edit" alone doesn't say what of; the section title completes it. */}
        <button
          aria-label={`${t('actions.edit')} — ${title}`}
          className="flex items-center gap-1 text-secondary hover:bg-secondary/10 px-3 py-1.5 rounded-lg transition-colors group-hover:bg-secondary/5"
          onClick={onEdit}
          type="button"
        >
          <Icon className="text-[18px]" name="edit" />
          <span className="text-label-caps font-label-caps">{t('actions.edit')}</span>
        </button>
      </div>
      {children}
    </section>
  )
}

/** Label above value, the layout used throughout the parcel card. */
function Field({ label, value, numeric = false, bold = false }) {
  return (
    <div className="flex flex-col gap-1">
      <span className={LABEL}>{label}</span>
      <span
        className={`text-body-md text-on-surface ${
          numeric ? 'font-tabular-nums' : 'font-body-md'
        } ${bold ? 'font-semibold' : ''}`}
      >
        {value}
      </span>
    </div>
  )
}

/** One row of the "Deed type / Consideration / Market value" list. */
function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center gap-4 py-2 border-b border-outline-variant/30">
      <span className="text-body-sm font-body-sm text-on-surface-variant">{label}</span>
      <span className="text-body-md font-tabular-nums text-on-surface font-medium">
        {value}
      </span>
    </div>
  )
}

/** One fee line inside the calculation panel. */
function Fee({ label, value }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-body-sm font-body-sm text-on-surface">{label}</span>
      <span className="text-body-sm font-tabular-nums text-on-surface">{value}</span>
    </div>
  )
}

/** Executant / claimant strip. */
function Party({ avatar, name, role, roleClass, aadhaar }) {
  const { t } = useI18n()
  return (
    <div className="bg-surface-container-low p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Decorative: the name is right beside it. */}
        <img
          alt=""
          className="w-12 h-12 rounded-full object-cover shadow-sm"
          src={avatar}
        />
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-body-md font-body-md text-on-surface font-semibold">
              {name}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-label-caps uppercase ${roleClass}`}
            >
              {role}
            </span>
          </div>
          <span className="text-body-sm font-tabular-nums text-on-surface-variant">
            {t('pages.review.partiesCard.aadhaarLine', { value: aadhaar })}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-status-success bg-status-success/10 px-3 py-1 rounded-full shrink-0">
        <Icon className="text-[16px]" name="verified" />
        <span className="text-label-caps font-label-caps">
          {t('pages.review.partiesCard.ekyc')}
        </span>
      </div>
    </div>
  )
}
