import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import DraftSavedNote from '../components/DraftSavedNote.jsx'
import SidebarStepper from '../components/SidebarStepper.jsx'
import { useRegistry } from '../context/RegistryContext.jsx'
import { useDemoNotice } from '../context/ToastContext.jsx'
import { useI18n } from '../i18n/index.jsx'
import { feeBreakdown } from '../lib/fees.js'
import { registryServicePath } from '../routes.js'

const FIELD =
  'w-full h-10 px-3 bg-surface-white border border-border-subtle rounded text-body-md font-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all'

const FORM_LABEL = 'text-body-sm font-body-sm font-semibold text-on-surface'

const BTN_SECONDARY =
  'w-full sm:w-auto h-12 px-6 rounded bg-surface-white border border-border-subtle text-on-surface font-body-md font-semibold hover:bg-surface-container transition-colors flex items-center justify-center gap-2'

/**
 * Canonical values, translated labels. As on the Parcel page, the original
 * `<option>` text *was* the stored value, so translating a label would have
 * rewritten the record.
 */
const TRANSACTION_TYPES = ['sale', 'gift', 'lease', 'mortgage']
const PURPOSES = ['residential', 'commercial', 'agricultural', 'industrial']

const digitsOnly = (s) => String(s).replace(/[^\d.]/g, '')

/** The two seeded document sizes, in MB — were welded into the strings. */
const IDENTITY_SIZE_MB = 2.4
const ENCUMBRANCE_SIZE_MB = 1.1
/** The mock upload's progress. Drives both the bar width and its label. */
const UPLOAD_PERCENT = 75

/** Steps 3 & 4 of 6 — was "Transaction & documents/TransactionsDocuments.html". */
export default function TransactionsDocuments() {
  const navigate = useNavigate()
  const { registry, update, set, saveDraft } = useRegistry()
  const { transaction, parcel, documentsUnlocked } = registry
  const { t, formatCurrency, formatDecimal } = useI18n()
  const demoNotice = useDemoNotice()
  const x = (key, vars) => t(`pages.transaction.${key}`, vars)

  const fileInputRef = useRef(null)
  const [extraDocs, setExtraDocs] = useState([])
  const [dragging, setDragging] = useState(false)

  const onField = (field) => (e) => update('transaction', field, e.target.value)

  const onValue = (e) => update('transaction', 'value', digitsOnly(e.target.value))

  /**
   * One computation for both figures. The original derived them separately —
   * `INR.format(numericValue || 4500000)` next to
   * `INR.format(stampDuty || 315000)` — so entering ₹1 displayed a
   * consideration of ₹1 beside a stamp duty of ₹3,15,000. It also used its own
   * 7% rate while the Review page used 6%.
   */
  const fees = feeBreakdown(transaction.value)

  const typeLabel = x(`types.${transaction.type || 'sale'}`)
  const purposeLabel = t(`landUse.${transaction.purpose || 'residential'}`)

  const mb = (n) => `${formatDecimal(n)} ${t('units.mb')}`

  const addFiles = (fileList) => {
    const added = Array.from(fileList ?? []).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      sizeMb: f.size / 1024 / 1024,
    }))
    if (added.length) setExtraDocs((list) => [...list, ...added])
  }

  return (
    <div className="flex flex-col w-full relative">
      <div className="px-margin-mobile md:px-margin-desktop py-8 max-w-container-max mx-auto w-full flex-grow flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-display font-display text-on-background">{x('title')}</h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant">{x('subtitle')}</p>
        </div>

        <div className="bg-surface-white rounded-xl shadow-sm w-full p-6 lg:p-8 flex flex-col lg:flex-row gap-12">
          {/* ---------------- left sidebar ---------------- */}
          <div className="w-full lg:w-1/4 flex flex-col gap-6 lg:sticky lg:top-24 h-max">
            {/*
              Was a local SIDEBAR_STEPS list reading "Applicant Details /
              Property Details / Transaction / Documents / Review" — a fourth
              vocabulary for the same six steps. Now the shared one.
            */}
            <SidebarStepper current={3} upto={5} />

            <div className="mt-8 p-4 bg-surface-container-low rounded-lg shadow-sm border border-border-subtle">
              <div className="flex items-center gap-2 mb-2 text-on-surface">
                <Icon className="text-secondary" name="info" />
                <h4 className="text-body-md font-headline-md font-semibold">
                  {x('help.heading')}
                </h4>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant">
                {x('help.bodyLead')}{' '}
                {/*
                  Was <a href="#guidelines">, and no element on the page has
                  that id — following it did nothing but add a fragment to the
                  URL. A button that says so is honest about the prototype.
                */}
                <button
                  className="text-secondary hover:underline"
                  onClick={() => demoNotice(x('help.linkLabel'))}
                  type="button"
                >
                  {x('help.linkLabel')}
                </button>{' '}
                {x('help.bodyTrail')}
              </p>
            </div>
          </div>

          {/* ---------------- right: steps 3 and 4 ---------------- */}
          <div className="w-full lg:w-3/4 flex flex-col gap-12 min-w-0">
            <section className="flex flex-col gap-6" id="step-3">
              <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
                <div
                  aria-hidden="true"
                  className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center"
                >
                  <span className="text-body-md font-headline-md">3</span>
                </div>
                <h2 className="text-headline-lg font-headline-lg text-on-surface">
                  {x('step3Heading')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className={FORM_LABEL} htmlFor="txn-type">
                    {x('typeLabel')} <Required />
                  </label>
                  <div className="relative">
                    <select
                      className={`${FIELD} appearance-none cursor-pointer`}
                      id="txn-type"
                      onChange={onField('type')}
                      value={transaction.type}
                    >
                      <option disabled value="">
                        {x('typePlaceholder')}
                      </option>
                      {TRANSACTION_TYPES.map((value) => (
                        <option key={value} value={value}>
                          {x(`types.${value}`)}
                        </option>
                      ))}
                    </select>
                    <Icon
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                      name="expand_more"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={FORM_LABEL} htmlFor="txn-value">
                    {x('valueLabel')} <Required />
                  </label>
                  <div className="relative">
                    {/* Decorative: the label already carries the ₹ symbol. */}
                    <span
                      aria-hidden="true"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-tabular-nums text-body-md"
                    >
                      ₹
                    </span>
                    <input
                      className={`${FIELD} pl-8 pr-3 text-tabular-nums font-tabular-nums`}
                      id="txn-value"
                      inputMode="decimal"
                      onChange={onValue}
                      placeholder={x('valuePlaceholder')}
                      type="text"
                      value={transaction.value}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className={FORM_LABEL} htmlFor="txn-date">
                    {x('dateLabel')} <Required />
                  </label>
                  <input
                    className={`${FIELD} cursor-pointer`}
                    id="txn-date"
                    onChange={onField('date')}
                    type="date"
                    value={transaction.date}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={FORM_LABEL} htmlFor="txn-purpose">
                    {x('purposeLabel')}
                  </label>
                  <div className="relative">
                    <select
                      className={`${FIELD} appearance-none cursor-pointer`}
                      id="txn-purpose"
                      onChange={onField('purpose')}
                      value={transaction.purpose}
                    >
                      <option disabled value="">
                        {x('purposePlaceholder')}
                      </option>
                      {PURPOSES.map((value) => (
                        <option key={value} value={value}>
                          {t(`landUse.${value}`)}
                        </option>
                      ))}
                    </select>
                    <Icon
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                      name="expand_more"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className={FORM_LABEL} htmlFor="txn-remarks">
                    {x('remarksLabel')}
                  </label>
                  <textarea
                    className="w-full p-3 bg-surface-white border border-border-subtle rounded text-body-md font-body-md text-on-surface focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all resize-y"
                    id="txn-remarks"
                    onChange={onField('remarks')}
                    placeholder={x('remarksPlaceholder')}
                    rows="3"
                    value={transaction.remarks}
                  />
                </div>
              </div>

              {/* Live summary — the original had these numbers hard-coded */}
              <div className="bg-surface-container rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-border-subtle shadow-sm mt-4 relative overflow-hidden">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-primary-fixed/20 to-transparent pointer-events-none"
                />
                <div className="flex flex-col gap-1 relative z-10">
                  <span className="text-label-caps font-label-caps text-on-surface-variant">
                    {x('summary.eyebrow')}
                  </span>
                  <h3 className="text-headline-md font-headline-md text-on-surface">
                    {x('summary.heading', { type: typeLabel, purpose: purposeLabel })}
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    {x('summary.propertyLabel')} <strong>{parcel.ulpin}</strong>
                    <span aria-hidden="true"> | </span>
                    {x('summary.valueLabel')}{' '}
                    <strong>{formatCurrency(fees.consideration)}</strong>
                  </p>
                </div>
                <div className="relative z-10 flex flex-col items-end">
                  <span className="text-label-caps font-label-caps text-on-surface-variant mb-1">
                    {x('summary.dutyLabel')}
                  </span>
                  <span className="text-display font-display text-primary tracking-tight">
                    {formatCurrency(fees.stampDuty)}
                  </span>
                </div>
              </div>
            </section>

            {/*
              Step 4 stays dimmed until unlocked. The original added
              `pointer-events-none`, which stops the mouse but leaves every
              button and the file input in the tab order — so a keyboard user
              could focus and trigger controls inside a section the page was
              presenting as unavailable. A disabled <fieldset> genuinely
              removes them.
            */}
            <fieldset
              className={`flex flex-col gap-6 border-0 p-0 m-0 min-w-0 transition-opacity duration-300 ${
                documentsUnlocked ? '' : 'opacity-50'
              }`}
              disabled={!documentsUnlocked}
              id="step-4"
            >
              {/*
                A <legend> has to be the fieldset's first child, and it cannot
                be laid out as part of the flex row below without breaking the
                heading. So the legend carries the name for assistive tech and
                the visible heading stays an <h2> in the document outline.
              */}
              <legend className="sr-only">{x('step4Heading')}</legend>

              <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
                <div
                  aria-hidden="true"
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    documentsUnlocked
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-container-high text-on-surface'
                  }`}
                >
                  <span className="text-body-md font-headline-md">4</span>
                </div>
                <h2 className="text-headline-lg font-headline-lg text-on-surface">
                  {x('step4Heading')}
                </h2>
              </div>

              <p className="text-body-md font-body-md text-on-surface-variant">
                {x('step4Lede')}
              </p>

              {!documentsUnlocked && (
                <p className="text-body-sm font-body-sm text-on-surface-variant italic">
                  {x('step4LockedNote')}
                </p>
              )}

              <div className="grid grid-cols-1 gap-4">
                {/* Not yet uploaded */}
                <div className="border border-border-subtle rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-white hover:bg-surface-container-lowest transition-colors shadow-sm group">
                  <div className="flex items-center gap-4">
                    <div
                      aria-hidden="true"
                      className="w-10 h-10 rounded bg-primary-fixed-dim/30 flex items-center justify-center text-primary"
                    >
                      <Icon name="description" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-body-md font-headline-md text-on-surface">
                        {x('docs.saleDeedName')} <Required />
                      </span>
                      <span className="text-body-sm font-body-sm text-on-surface-variant">
                        {x('docs.saleDeedMeta')}
                      </span>
                    </div>
                  </div>
                  <button
                    className="h-10 px-4 rounded bg-surface-white border border-border-subtle text-on-surface font-body-md hover:bg-surface-container hover:text-primary transition-colors flex items-center gap-2 group-hover:border-secondary"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    <Icon className="text-[20px]" name="upload" />
                    {t('actions.upload')}
                  </button>
                </div>

                {/* In progress */}
                <div className="border border-secondary rounded-lg p-4 flex flex-col gap-3 bg-secondary-fixed/10 shadow-sm relative overflow-hidden">
                  {/* The bar is a duplicate of the percentage read out below it. */}
                  <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-1 bg-secondary w-3/4 transition-all duration-1000 ease-in-out"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        aria-hidden="true"
                        className="w-10 h-10 rounded bg-surface-white border border-border-subtle flex items-center justify-center text-secondary"
                      >
                        <Icon name="badge" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-body-md font-headline-md text-on-surface">
                          {x('docs.identityName')} <Required />
                        </span>
                        <span className="text-body-sm font-body-sm text-on-surface-variant">
                          {x('docs.identityMeta', { size: mb(IDENTITY_SIZE_MB) })}
                        </span>
                      </div>
                    </div>
                    <button
                      aria-label={x('docs.cancelUpload')}
                      className="text-on-surface-variant hover:text-status-error transition-colors p-1"
                      onClick={() => demoNotice(x('docs.cancelUpload'))}
                      type="button"
                    >
                      <Icon name="close" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-body-sm font-body-sm text-secondary">
                    <Icon className="text-[16px] animate-spin" name="sync" />
                    {x('docs.identityUploading', {
                      percent: `${UPLOAD_PERCENT}${t('units.percent')}`,
                    })}
                  </div>
                </div>

                {/* Verified */}
                <div className="border border-status-success/30 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-status-success/5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div
                      aria-hidden="true"
                      className="w-10 h-10 rounded bg-status-success flex items-center justify-center text-on-secondary shadow-md"
                    >
                      <Icon name="check" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-body-md font-headline-md text-on-surface">
                        {x('docs.encumbranceName')} <Required />
                      </span>
                      <span className="text-body-sm font-body-sm text-on-surface-variant">
                        {x('docs.encumbranceMeta', { size: mb(ENCUMBRANCE_SIZE_MB) })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-status-success text-body-sm font-body-sm font-semibold flex items-center gap-1">
                      <Icon className="text-[16px]" name="verified" /> {t('status.verified')}
                    </span>
                    <button
                      aria-label={t('actions.moreActions')}
                      className="h-10 w-10 flex items-center justify-center rounded hover:bg-surface-container-high transition-colors text-on-surface-variant"
                      onClick={() => demoNotice(t('actions.moreActions'))}
                      type="button"
                    >
                      <Icon className="text-[20px]" name="more_vert" />
                    </button>
                  </div>
                </div>

                {/* Files the user actually attaches through the dropzone */}
                {extraDocs.map((doc) => (
                  <div
                    className="border border-border-subtle rounded-lg p-4 flex items-center justify-between gap-4 bg-surface-white shadow-sm"
                    key={doc.id}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        aria-hidden="true"
                        className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0"
                      >
                        <Icon name="attach_file" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-body-md font-headline-md text-on-surface truncate">
                          {doc.name}
                        </span>
                        <span className="text-body-sm font-body-sm text-on-surface-variant">
                          {x('docs.attachedMeta', { size: mb(doc.sizeMb) })}
                        </span>
                      </div>
                    </div>
                    <button
                      aria-label={`${t('actions.remove')} — ${doc.name}`}
                      className="text-on-surface-variant hover:text-status-error transition-colors p-1"
                      onClick={() =>
                        setExtraDocs((list) => list.filter((d) => d.id !== doc.id))
                      }
                      type="button"
                    >
                      <Icon name="close" />
                    </button>
                  </div>
                ))}

                {/* Dropzone — the original was decorative only */}
                <button
                  className={`border border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer text-center group w-full ${
                    dragging
                      ? 'border-secondary bg-secondary-fixed/20'
                      : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragLeave={() => setDragging(false)}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragging(true)
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragging(false)
                    addFiles(e.dataTransfer.files)
                  }}
                  type="button"
                >
                  <div
                    aria-hidden="true"
                    className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-secondary group-hover:bg-secondary-fixed/50 transition-colors mb-2"
                  >
                    <Icon className="text-[24px]" name="note_add" />
                  </div>
                  <span className="text-body-md font-headline-md text-on-surface group-hover:text-secondary transition-colors">
                    {x('dropzone.heading')}
                  </span>
                  <span className="text-body-sm font-body-sm text-on-surface-variant">
                    {x('dropzone.hint')}
                  </span>
                  <span className="text-label-caps font-label-caps text-outline mt-2">
                    {x('dropzone.optional')}
                  </span>
                </button>

                <input
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  multiple
                  onChange={(e) => {
                    addFiles(e.target.files)
                    e.target.value = ''
                  }}
                  ref={fileInputRef}
                  type="file"
                />
              </div>
            </fieldset>
          </div>
        </div>

        {/* ---------------- sticky action bar ---------------- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-white p-6 rounded-xl shadow-md border-t-4 border-secondary sticky bottom-6 z-20">
          <button
            className={BTN_SECONDARY}
            onClick={() => navigate(registryServicePath(registry.serviceType, 'owner'))}
            type="button"
          >
            <Icon name="arrow_back" />
            {t('actions.previousStep')}
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <DraftSavedNote />
            <button className={BTN_SECONDARY} onClick={saveDraft} type="button">
              <Icon name="save" />
              {t('actions.saveDraft')}
            </button>

            {/* Original: an inline onclick that un-dimmed step 4 and rewrote itself. */}
            {documentsUnlocked ? (
              <button
                className="w-full sm:w-auto h-12 px-8 rounded bg-primary text-on-primary font-body-md font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm group"
                onClick={() => navigate(registryServicePath(registry.serviceType, 'review'))}
                type="button"
              >
                {x('continueToReview')}
                <Icon
                  className="group-hover:translate-x-1 transition-transform"
                  name="arrow_forward"
                />
              </button>
            ) : (
              <button
                className="w-full sm:w-auto h-12 px-8 rounded bg-primary text-on-primary font-body-md font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
                onClick={() => set('documentsUnlocked', true)}
                type="button"
              >
                {x('unlock')}
                <Icon name="lock_open" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * The asterisk alone conveyed "required" only to people who can see it and
 * know the convention. The word goes into the accessible name; the glyph stays
 * decorative.
 */
function Required() {
  const { t } = useI18n()
  return (
    <>
      <span aria-hidden="true" className="text-status-error">
        *
      </span>
      <span className="sr-only"> {t('requiredMark')}</span>
    </>
  )
}
