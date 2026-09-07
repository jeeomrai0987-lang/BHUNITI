import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import DraftSavedNote from '../components/DraftSavedNote.jsx'
import SidebarStepper from '../components/SidebarStepper.jsx'
import { useRegistry } from '../context/RegistryContext.jsx'
import { useI18n } from '../i18n/index.jsx'
import { registryServicePath } from '../routes.js'

const FIELD =
  'w-full h-10 px-3 bg-surface-container-lowest text-on-surface rounded ring-1 ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary transition-shadow placeholder:text-on-surface-variant/50'

const LABEL = 'font-label-caps text-label-caps text-on-surface-variant'

const CONTEXT_MAP =
  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCJzWc90kvzXtPBkXyxq76EPV4qxxpn5J_KyjdO80ksxoqm3V2KvO3jE1rnck2aL7djoOtQfYdB1lr8xhtGABNfHc4baT2n9nri5wsXFahuC9MecYyg2xNtPGMq9tQ7AWkw0zfkixV20nffN-vc37JvgKdV-4bSlesIgc-dy_RiKvgT-N2AmU48RAre8KMqTHxJgII1RwPa7mKJqIJQGJ88AwS9GIvJSqAvTgn6Wma4IbJ0VhR0rbQ')"

/** Placeholder swap that the original page's DOMContentLoaded script did. */
const ID_PLACEHOLDERS = {
  aadhaar: 'XXXX XXXX XXXX',
  pan: 'ABCDE1234F',
}

const ID_TYPES = ['aadhaar', 'pan', 'voter', 'passport']
const PARTY_ROLES = ['witness', 'poa', 'guardian', 'confirming']

/**
 * Aadhaar grouping, ported from the original `input` listener. The original
 * returned the raw string untouched for every other document type, so a PAN
 * typed in lower case stayed lower case even though PANs are upper-case only.
 */
const formatIdNumber = (raw, idType) => {
  if (idType === 'aadhaar') {
    return raw
      .replace(/\D/g, '')
      .substring(0, 12)
      .replace(/(.{4})/g, '$1 ')
      .trim()
  }
  if (idType === 'pan' || idType === 'voter' || idType === 'passport') {
    return raw.toUpperCase()
  }
  return raw
}

/** Step 2 of 6 — was "owner & party details 2/OwnerAndParty.html". */
export default function OwnerAndParty() {
  const navigate = useNavigate()
  const { registry, update, saveDraft } = useRegistry()
  const { transferee, parcel } = registry
  const { t, formatNumber } = useI18n()
  const o = (key, vars) => t(`pages.owner.${key}`, vars)

  const [coOwners, setCoOwners] = useState([])
  const [extraParties, setExtraParties] = useState([])

  const onField = (field) => (e) => update('transferee', field, e.target.value)

  const onIdType = (e) => {
    update('transferee', 'idType', e.target.value)
    update('transferee', 'idNumber', formatIdNumber(transferee.idNumber, e.target.value))
  }

  const onIdNumber = (e) =>
    update('transferee', 'idNumber', formatIdNumber(e.target.value, transferee.idType))

  // Donut: the primary owner keeps whatever share isn't assigned to co-owners.
  // `Math.max(0, …)` silently clamped an over-allocation to zero in the
  // original, so entering 60 + 60 looked like a valid 0% primary share.
  const assigned = coOwners.reduce((sum, c) => sum + (Number(c.share) || 0), 0)
  const primaryShare = Math.max(0, 100 - assigned)
  const overAllocated = assigned > 100

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 lg:py-12 flex flex-col lg:flex-row gap-12">
        {/* ---------------- left sidebar ---------------- */}
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-8 relative">
          <div className="flex flex-col gap-2">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {o('asideHeading')}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {o('transactionIdLabel')}{' '}
              <span className="font-tabular-nums text-tabular-nums text-on-surface font-semibold tracking-wider">
                {registry.transactionId}
              </span>
            </p>
          </div>

          <SidebarStepper current={2} upto={4} />

          {/* Property context — reads the parcel captured in step 1 */}
          <div className="mt-auto pt-8">
            <div className="flex flex-col gap-3 p-4 bg-surface-container-lowest rounded-xl shadow-sm">
              <span className={LABEL}>{o('propertyContextLabel')}</span>
              {/*
                The button's only content was a background image and its name
                came from `title=`, which is not an accessible name. It now
                has real text, visually hidden.
              */}
              <button
                className="w-full h-32 rounded-lg bg-cover bg-center overflow-hidden relative shadow-inner"
                onClick={() => navigate(registryServicePath(registry.serviceType, 'parcel'))}
                style={{ backgroundImage: CONTEXT_MAP }}
                type="button"
              >
                <span className="sr-only">{o('propertyContextAction')}</span>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-tertiary-container/40 to-transparent"
                />
              </button>
              <p className="font-body-sm text-body-sm text-on-surface truncate">
                {o('parcelIdLine', {
                  survey: parcel.surveyNo,
                  plot: parcel.plotNo,
                  village: parcel.village,
                })}
              </p>
            </div>
          </div>
        </aside>

        {/* ---------------- right workspace ---------------- */}
        <div className="flex-1 flex flex-col gap-10 min-w-0">
          {/* Section: current registered owner */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {o('currentOwner.heading')}
              </h3>
              <div className="px-3 py-1 bg-status-success/10 rounded-full flex items-center gap-1.5">
                <div
                  aria-hidden="true"
                  className="w-2 h-2 rounded-full bg-status-success animate-pulse"
                />
                <span className="font-label-caps text-label-caps text-status-success">
                  {o('currentOwner.verifiedBadge')}
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-8 relative overflow-hidden group">
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 bottom-0 w-1 bg-secondary transition-transform transform origin-left group-hover:scale-x-150"
              />

              {/* Ownership share donut */}
              <div className="w-32 flex flex-col items-center justify-center gap-2 shrink-0">
                <div className="relative w-24 h-24">
                  {/* The <svg> had no accessible name, so the only statement of
                      the primary owner's share was a visual one. */}
                  <svg
                    aria-label={o('currentOwner.shareChartLabel', {
                      share: formatNumber(primaryShare),
                    })}
                    className="w-full h-full transform -rotate-90"
                    role="img"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-surface-container-high"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="text-secondary"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray={`${primaryShare}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                  </svg>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center flex-col"
                  >
                    <span className="font-headline-md text-headline-md text-on-surface">
                      {formatNumber(primaryShare)}
                      <span className="text-body-sm">{t('units.percent')}</span>
                    </span>
                  </div>
                </div>
                <span className={`${LABEL} text-center`}>
                  {coOwners.length
                    ? o('currentOwner.primaryOwner')
                    : o('currentOwner.soleOwner')}
                </span>
              </div>

              {/* Owner details */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                <Detail
                  label={o('currentOwner.fullNameLabel')}
                  value={o('currentOwner.name')}
                  valueClass="font-medium"
                />
                <Detail
                  label={o('currentOwner.parentageLabel')}
                  value={o('currentOwner.parentage')}
                />
                <Detail label={o('currentOwner.dobLabel')} numeric value={o('currentOwner.dob')} />
                <Detail label={o('currentOwner.mobileLabel')} numeric value="+91 98*** ***12" />
                <Detail label={o('currentOwner.emailLabel')} value="raj***@gmail.com" />
                <div className="flex flex-col gap-1">
                  <span className={LABEL}>{o('currentOwner.govtIdLabel')}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-tabular-nums text-tabular-nums text-on-surface tracking-wider">
                      XXXX XXXX 4921
                    </span>
                    <Icon className="text-[16px] text-status-success" name="verified_user" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
                  <span className={LABEL}>{o('currentOwner.addressLabel')}</span>
                  <span className="font-body-md text-body-md text-on-surface">
                    {o('currentOwner.address')}
                  </span>
                </div>
              </div>
            </div>

            {/* Co-owner rows */}
            {coOwners.map((co, i) => (
              <div
                className="bg-surface-container-lowest rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-[1fr_120px_auto] gap-4 items-end"
                key={co.id}
              >
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL} htmlFor={`co-name-${co.id}`}>
                    {o('coOwner.nameLabel', { n: i + 1 })}
                  </label>
                  <input
                    className={`${FIELD} font-body-md text-body-md`}
                    id={`co-name-${co.id}`}
                    onChange={(e) =>
                      setCoOwners((list) =>
                        list.map((c) => (c.id === co.id ? { ...c, name: e.target.value } : c)),
                      )
                    }
                    placeholder={o('coOwner.namePlaceholder')}
                    type="text"
                    value={co.name}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL} htmlFor={`co-share-${co.id}`}>
                    {o('coOwner.shareLabel')}
                  </label>
                  <input
                    className={`${FIELD} font-tabular-nums text-tabular-nums`}
                    id={`co-share-${co.id}`}
                    max="100"
                    min="0"
                    onChange={(e) =>
                      setCoOwners((list) =>
                        list.map((c) => (c.id === co.id ? { ...c, share: e.target.value } : c)),
                      )
                    }
                    type="number"
                    value={co.share}
                  />
                </div>
                <button
                  aria-label={o('coOwner.remove', { n: i + 1 })}
                  className="h-10 w-10 flex items-center justify-center rounded text-on-surface-variant hover:text-status-error transition-colors"
                  onClick={() => setCoOwners((list) => list.filter((c) => c.id !== co.id))}
                  type="button"
                >
                  <Icon name="delete" />
                </button>
              </div>
            ))}

            {overAllocated && (
              <p className="font-body-sm text-body-sm text-status-error" role="alert">
                {o('coOwner.overAllocated', { total: formatNumber(assigned) })}
              </p>
            )}

            <div className="flex justify-start">
              <button
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-white hover:bg-surface-container-low text-secondary font-body-md text-body-md font-medium transition-colors shadow-sm ring-1 ring-outline-variant hover:ring-secondary"
                onClick={() =>
                  setCoOwners((list) => [
                    ...list,
                    { id: crypto.randomUUID(), name: '', share: '' },
                  ])
                }
                type="button"
              >
                <Icon
                  className="text-[20px] transition-transform group-hover:rotate-90"
                  name="add"
                />
                {o('coOwner.add')}
              </button>
            </div>
          </section>
          {/* Section: new owner / transferee */}
          <section className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {o('transferee.heading')}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {o('transferee.lede')}
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col gap-6 relative">
              <div
                aria-hidden="true"
                className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-primary-fixed/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none opacity-50"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL} htmlFor="transferee-name">
                    {o('transferee.nameLabel')} <Required />
                  </label>
                  <input
                    className={`${FIELD} font-body-md text-body-md`}
                    id="transferee-name"
                    onChange={onField('name')}
                    placeholder={o('transferee.namePlaceholder')}
                    required
                    type="text"
                    value={transferee.name}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL} htmlFor="transferee-parent">
                    {o('transferee.parentLabel')} <Required />
                  </label>
                  <input
                    className={`${FIELD} font-body-md text-body-md`}
                    id="transferee-parent"
                    onChange={onField('parentage')}
                    placeholder={o('transferee.parentPlaceholder')}
                    required
                    type="text"
                    value={transferee.parentage}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL} htmlFor="transferee-mobile">
                    {o('transferee.mobileLabel')} <Required />
                  </label>
                  <div className="flex w-full h-10 rounded ring-1 ring-outline-variant focus-within:ring-2 focus-within:ring-secondary transition-shadow overflow-hidden bg-surface-container-lowest">
                    <span className="flex items-center px-3 bg-surface-container-low text-on-surface-variant font-tabular-nums text-tabular-nums border-r border-outline-variant">
                      +91
                    </span>
                    <input
                      className="flex-1 px-3 bg-transparent text-on-surface font-tabular-nums text-tabular-nums focus:outline-none placeholder:text-on-surface-variant/50"
                      id="transferee-mobile"
                      onChange={onField('mobile')}
                      placeholder={o('transferee.mobilePlaceholder')}
                      required
                      type="tel"
                      value={transferee.mobile}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL} htmlFor="transferee-email">
                    {o('transferee.emailLabel')}
                  </label>
                  <input
                    className={`${FIELD} font-body-md text-body-md`}
                    id="transferee-email"
                    onChange={onField('email')}
                    placeholder={o('transferee.emailPlaceholder')}
                    type="email"
                    value={transferee.email}
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className={LABEL} htmlFor="transferee-address">
                    {o('transferee.addressLabel')} <Required />
                  </label>
                  <textarea
                    className="w-full p-3 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded ring-1 ring-outline-variant focus:outline-none focus:ring-2 focus:ring-secondary transition-shadow placeholder:text-on-surface-variant/50 resize-none"
                    id="transferee-address"
                    onChange={onField('address')}
                    placeholder={o('transferee.addressPlaceholder')}
                    required
                    rows="2"
                    value={transferee.address}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL} htmlFor="transferee-id-type">
                    {o('transferee.idTypeLabel')} <Required />
                  </label>
                  <div className="relative">
                    <select
                      className={`${FIELD} appearance-none font-body-md text-body-md`}
                      id="transferee-id-type"
                      onChange={onIdType}
                      required
                      value={transferee.idType}
                    >
                      <option disabled value="">
                        {o('transferee.idTypePlaceholder')}
                      </option>
                      {ID_TYPES.map((code) => (
                        <option key={code} value={code}>
                          {o(`transferee.idTypes.${code}`)}
                        </option>
                      ))}
                    </select>
                    <Icon
                      className="absolute right-3 top-2.5 text-on-surface-variant pointer-events-none"
                      name="expand_more"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={LABEL} htmlFor="transferee-id-number">
                    {o('transferee.idNumberLabel')} <Required />
                  </label>
                  <input
                    className={`${FIELD} font-tabular-nums text-tabular-nums tracking-wide`}
                    id="transferee-id-number"
                    onChange={onIdNumber}
                    placeholder={
                      ID_PLACEHOLDERS[transferee.idType] ?? o('transferee.idNumberPlaceholder')
                    }
                    required
                    type="text"
                    value={transferee.idNumber}
                  />
                </div>
              </div>
            </div>

            {/* Additional parties */}
            {extraParties.map((party, i) => (
              <div
                className="bg-surface-container-lowest rounded-xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end"
                key={party.id}
              >
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL} htmlFor={`party-name-${party.id}`}>
                    {o('parties.nameLabel', { n: i + 1 })}
                  </label>
                  <input
                    className={`${FIELD} font-body-md text-body-md`}
                    id={`party-name-${party.id}`}
                    onChange={(e) =>
                      setExtraParties((list) =>
                        list.map((p) =>
                          p.id === party.id ? { ...p, name: e.target.value } : p,
                        ),
                      )
                    }
                    placeholder={o('parties.namePlaceholder')}
                    type="text"
                    value={party.name}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={LABEL} htmlFor={`party-role-${party.id}`}>
                    {o('parties.roleLabel')}
                  </label>
                  <select
                    className={`${FIELD} appearance-none font-body-md text-body-md`}
                    id={`party-role-${party.id}`}
                    onChange={(e) =>
                      setExtraParties((list) =>
                        list.map((p) =>
                          p.id === party.id ? { ...p, role: e.target.value } : p,
                        ),
                      )
                    }
                    value={party.role}
                  >
                    {PARTY_ROLES.map((code) => (
                      <option key={code} value={code}>
                        {o(`parties.roles.${code}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  aria-label={o('parties.remove', { n: i + 1 })}
                  className="h-10 w-10 flex items-center justify-center rounded text-on-surface-variant hover:text-status-error transition-colors"
                  onClick={() =>
                    setExtraParties((list) => list.filter((p) => p.id !== party.id))
                  }
                  type="button"
                >
                  <Icon name="delete" />
                </button>
              </div>
            ))}

            <div className="flex justify-start">
              <button
                className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-white hover:bg-surface-container-low text-secondary font-body-md text-body-md font-medium transition-colors shadow-sm ring-1 ring-outline-variant hover:ring-secondary"
                onClick={() =>
                  setExtraParties((list) => [
                    ...list,
                    { id: crypto.randomUUID(), name: '', role: 'witness' },
                  ])
                }
                type="button"
              >
                <Icon
                  className="text-[20px] transition-transform group-hover:rotate-90"
                  name="person_add"
                />
                {o('parties.add')}
              </button>
            </div>
          </section>

          {/* ---------------- bottom action bar ---------------- */}
          <div className="flex flex-wrap gap-4 items-center justify-between border-t border-outline-variant pt-6 mt-4">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-on-surface-variant font-label-caps text-label-caps tracking-wider hover:bg-surface-container-low transition-colors"
              onClick={() => navigate(registryServicePath(registry.serviceType, 'parcel'))}
              type="button"
            >
              <Icon className="text-[18px]" name="arrow_back" />
              {t('actions.previous')}
            </button>

            <div className="flex flex-wrap items-center gap-4">
              <DraftSavedNote />
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-surface-white ring-1 ring-outline text-on-surface font-label-caps text-label-caps tracking-wider hover:bg-surface-container-lowest transition-colors"
                onClick={saveDraft}
                type="button"
              >
                <Icon className="text-[18px]" name="draft" />
                {t('actions.saveDraftCaps')}
              </button>
              <button
                className="group flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-on-primary font-label-caps text-label-caps tracking-wider shadow-md hover:bg-primary/90 transition-colors"
                onClick={() => navigate(registryServicePath(registry.serviceType, 'transaction'))}
                type="button"
              >
                {o('continueToTransaction')}
                <Icon
                  className="text-[18px] group-hover:translate-x-1 transition-transform"
                  name="arrow_forward"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * The required-field asterisk. It was a bare `<span>*</span>`, which a screen
 * reader either skips or reads as "star"; the word is now in the accessible
 * name and the glyph is decorative.
 */
function Required() {
  const { t } = useI18n()
  return (
    <span className="text-status-error">
      <span aria-hidden="true">*</span>
      <span className="sr-only"> {t('requiredMark')}</span>
    </span>
  )
}

/** Read-only label/value pair used by the registered-owner card. */
function Detail({ label, value, numeric = false, valueClass = '' }) {
  return (
    <div className="flex flex-col gap-1">
      <span className={LABEL}>{label}</span>
      <span
        className={`${
          numeric ? 'font-tabular-nums text-tabular-nums' : 'font-body-md text-body-md'
        } text-on-surface ${valueClass}`}
      >
        {value}
      </span>
    </div>
  )
}
