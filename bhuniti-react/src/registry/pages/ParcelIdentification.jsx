import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import GisMap from '../components/GisMap.jsx'
import HorizontalStepper from '../components/HorizontalStepper.jsx'
import DraftSavedNote from '../components/DraftSavedNote.jsx'
import { useRegistry } from '../context/RegistryContext.jsx'
import { useI18n } from '../i18n/index.jsx'
import { registryServicePath, TOTAL_STEPS } from '../routes.js'

const INPUT =
  'w-full h-12 px-4 rounded-lg bg-surface-container-lowest border border-border-subtle focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-on-surface'

const LABEL = 'text-label-caps font-label-caps text-on-surface-variant'

const MAP_BTN =
  'w-10 h-10 bg-surface-white/90 backdrop-blur-sm rounded shadow-sm flex items-center justify-center text-on-surface-variant hover:text-secondary transition-colors border-none'

/**
 * The three dropdowns' canonical values. The original wrote
 * `<option>Maharashtra</option>` with no `value`, so the *visible text* was
 * also the stored value — translating the label would have silently rewritten
 * the record. Values stay English; only the label is translated.
 */
const STATES = ['Maharashtra', 'Gujarat', 'Karnataka']
const DISTRICTS = ['Pune', 'Mumbai', 'Nagpur']
const TEHSILS = ['Haveli', 'Khed']

/** Step 1 of 6 — was "Parcel identification /Parcel Identification.html". */
export default function ParcelIdentification() {
  const navigate = useNavigate()
  const { registry, update, saveDraft } = useRegistry()
  const { parcel } = registry
  const mapRef = useRef(null)
  const [searchError, setSearchError] = useState('')
  const { t, formatDecimal, tOr } = useI18n()
  const p = (key, vars) => t(`pages.parcel.${key}`, vars)
  /**
   * Place names are translated for display only; the stored value is unchanged.
   * A name that isn't in the catalog falls back to itself rather than showing
   * the dotted key `t()` returns for a miss.
   */
  const place = (name) => tOr(`pages.parcel.places.${name}`, name)

  const onField = (field) => (e) => update('parcel', field, e.target.value)

  // Was the global `searchParcel()` function.
  const searchParcel = () => {
    if (parcel.ulpin.trim() === '') {
      setSearchError(p('searchErrorEmpty'))
      return
    }
    setSearchError('')
    mapRef.current?.locate()
  }

  return (
    <div className="flex flex-col w-full h-full p-4 lg:p-8 bg-surface gap-6">
      {/* Page title */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Icon className="text-secondary" fill name="shield" />
          <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight">
            {p('title')}
          </h1>
        </div>
        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
          {p('lede')}
        </p>
      </div>

      <HorizontalStepper currentStep={1} />

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* ---------------- left: form ---------------- */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="bg-surface-white rounded-xl shadow-sm p-6 flex flex-col gap-6 border-none relative overflow-hidden">
            {/* Decorative corner wash. */}
            <div
              aria-hidden="true"
              className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed rounded-bl-full opacity-20 -z-10 pointer-events-none"
            />

            <div className="flex items-center justify-between border-b border-surface-variant pb-4">
              <h2 className="text-headline-md font-headline-md text-on-surface flex items-center gap-2">
                <Icon className="text-secondary" name="location_on" />
                {p('sectionTitle')}
              </h2>
              <span className="px-2 py-1 bg-surface-container-low rounded text-label-caps font-label-caps text-on-surface-variant">
                {t('stepOf', { current: 1, total: TOTAL_STEPS })}
              </span>
            </div>

            {/* ULPIN */}
            <div className="flex flex-col gap-2">
              <label className={LABEL} htmlFor="ulpinInput">
                {p('ulpinLabel')}
              </label>
              <div className="flex gap-2">
                <input
                  aria-describedby={searchError ? 'ulpin-error' : undefined}
                  className="w-full h-12 px-4 rounded-lg bg-surface-white border border-border-subtle focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-body-lg font-body-lg text-on-surface transition-all"
                  id="ulpinInput"
                  onChange={onField('ulpin')}
                  onKeyDown={(e) => e.key === 'Enter' && searchParcel()}
                  placeholder={p('ulpinPlaceholder')}
                  type="text"
                  value={parcel.ulpin}
                />
                <button
                  className="h-12 px-6 bg-secondary text-on-secondary rounded-lg font-label-caps text-label-caps tracking-wider hover:bg-secondary-container transition-colors shadow-sm flex items-center gap-2 shrink-0"
                  onClick={searchParcel}
                  type="button"
                >
                  <Icon className="text-[18px]" name="search" />
                  {t('actions.search')}
                </button>
              </div>
              {searchError && (
                <p
                  className="text-body-sm font-body-sm text-status-error"
                  id="ulpin-error"
                  role="alert"
                >
                  {searchError}
                </p>
              )}
            </div>

            {/* State / District / Tehsil / Village */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className={LABEL} htmlFor="state">
                  {p('stateLabel')}
                </label>
                <select
                  className={`${INPUT} text-body-md font-body-md appearance-none`}
                  id="state"
                  onChange={onField('state')}
                  value={parcel.state}
                >
                  {STATES.map((name) => (
                    <option key={name} value={name}>
                      {place(name)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className={LABEL} htmlFor="district">
                  {p('districtLabel')}
                </label>
                <select
                  className={`${INPUT} text-body-md font-body-md appearance-none`}
                  id="district"
                  onChange={onField('district')}
                  value={parcel.district}
                >
                  {DISTRICTS.map((name) => (
                    <option key={name} value={name}>
                      {place(name)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className={LABEL} htmlFor="tehsil">
                  {p('tehsilLabel')}
                </label>
                <select
                  className={`${INPUT} text-body-md font-body-md appearance-none`}
                  id="tehsil"
                  onChange={onField('tehsil')}
                  value={parcel.tehsil}
                >
                  {TEHSILS.map((name) => (
                    <option key={name} value={name}>
                      {place(name)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className={LABEL} htmlFor="village">
                  {p('villageLabel')}
                </label>
                <input
                  className={`${INPUT} text-body-md font-body-md`}
                  id="village"
                  onChange={onField('village')}
                  type="text"
                  value={parcel.village}
                />
              </div>
            </div>

            {/* Survey / Plot / RoR */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex flex-col gap-2">
                <label className={LABEL} htmlFor="surveyNo">
                  {p('surveyLabel')}
                </label>
                <input
                  className={`${INPUT} text-tabular-nums font-tabular-nums`}
                  id="surveyNo"
                  onChange={onField('surveyNo')}
                  type="text"
                  value={parcel.surveyNo}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={LABEL} htmlFor="plotNo">
                  {p('plotLabel')}
                </label>
                <input
                  className={`${INPUT} text-tabular-nums font-tabular-nums`}
                  id="plotNo"
                  onChange={onField('plotNo')}
                  type="text"
                  value={parcel.plotNo}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={LABEL} htmlFor="rorRef">
                  {p('rorLabel')}
                </label>
                <input
                  className={`${INPUT} text-tabular-nums font-tabular-nums`}
                  id="rorRef"
                  onChange={onField('rorRef')}
                  type="text"
                  value={parcel.rorRef}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- right: GIS map ---------------- */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="relative w-full h-[400px] lg:h-[500px] rounded-xl shadow-md overflow-hidden bg-surface-container-high group border-none">
            <GisMap
              ref={mapRef}
              surveyNo={parcel.surveyNo}
              ulpin={parcel.ulpin}
              village={parcel.village}
            />

            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-[400]">
              <div className="bg-surface-white/90 backdrop-blur-sm px-3 py-1.5 rounded shadow-sm flex items-center gap-2 pointer-events-auto border-none">
                {/* Decorative pulse dot; the label beside it carries the meaning. */}
                <div
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full bg-status-success animate-pulse"
                />
                <span className="text-label-caps font-label-caps text-on-surface">
                  {t('map.liveSync')}
                </span>
              </div>

              <div className="flex flex-col gap-2 pointer-events-auto">
                <button
                  aria-label={t('map.zoomIn')}
                  className={MAP_BTN}
                  onClick={() => mapRef.current?.zoomIn()}
                  type="button"
                >
                  <Icon name="add" />
                </button>
                <button
                  aria-label={t('map.zoomOut')}
                  className={MAP_BTN}
                  onClick={() => mapRef.current?.zoomOut()}
                  type="button"
                >
                  <Icon name="remove" />
                </button>
                <button
                  aria-label={t('map.locate')}
                  className={MAP_BTN}
                  onClick={() => mapRef.current?.locate()}
                  type="button"
                >
                  <Icon name="my_location" />
                </button>
              </div>
            </div>

            {/* Selected parcel details — now reflects the form above */}
            <div className="absolute bottom-4 left-4 right-4 bg-surface-white/95 backdrop-blur-md rounded-xl shadow-lg p-5 pointer-events-auto border-none transform transition-transform duration-300 z-[400]">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-label-caps font-label-caps text-secondary mb-1">
                    {p('selected.eyebrow')}
                  </p>
                  <h3 className="text-headline-md font-headline-md text-on-surface uppercase">
                    {p('selected.heading', {
                      survey: parcel.surveyNo || t('notAvailable'),
                      village: parcel.village || t('notAvailable'),
                    })}
                  </h3>
                </div>
                <span className="px-2 py-1 bg-status-success/10 text-status-success rounded text-label-caps font-label-caps border border-status-success/20 shrink-0">
                  {t('status.verifiedCaps')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-t border-surface-variant">
                <div>
                  <p className={LABEL}>{p('selected.areaLabel')}</p>
                  <p className="text-tabular-nums font-tabular-nums text-on-surface font-semibold">
                    {/* Read from context so this page and Review can no longer
                        report different areas for the same parcel. */}
                    {formatDecimal(parcel.areaAcres)} {t('units.acre')}
                  </p>
                </div>
                <div>
                  <p className={LABEL}>{p('selected.landUseLabel')}</p>
                  <p className="text-body-sm font-body-sm text-on-surface font-semibold">
                    {t(`landUse.${parcel.landUse}`)}
                  </p>
                </div>
                <div>
                  <p className={LABEL}>{p('selected.encumbranceLabel')}</p>
                  <p className="text-body-sm font-body-sm text-on-surface font-semibold">
                    {p('selected.encumbranceNone')}
                  </p>
                </div>
                <div>
                  <p className={LABEL}>{p('selected.ownerLabel')}</p>
                  <p className="text-body-sm font-body-sm text-on-surface font-semibold truncate">
                    {p('selected.ownerValue')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- bottom buttons ---------------- */}
      <div className="w-full flex flex-wrap gap-4 justify-between items-center bg-surface-white p-6 rounded-xl shadow-sm mt-auto border-none">
        <div className="flex items-center gap-4">
          <button
            className="px-6 py-3 bg-surface-white border border-outline text-on-surface font-label-caps text-label-caps tracking-wider rounded-lg hover:bg-surface-container-lowest transition-colors flex items-center gap-2"
            onClick={saveDraft}
            type="button"
          >
            <Icon className="text-[18px]" name="draft" />
            {t('actions.saveDraftCaps')}
          </button>
          <DraftSavedNote />
        </div>

        <button
          className="px-8 py-3 bg-primary text-on-primary font-label-caps text-label-caps tracking-wider rounded-lg hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2 group"
          onClick={() => navigate(registryServicePath(registry.serviceType, 'owner'))}
          type="button"
        >
          {p('continueToParties')}
          <Icon
            className="text-[18px] group-hover:translate-x-1 transition-transform"
            name="arrow_forward"
          />
        </button>
      </div>
    </div>
  )
}
