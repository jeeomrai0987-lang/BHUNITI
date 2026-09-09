import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { PARCEL_AREA_ACRES } from '../lib/fees.js'

/**
 * Shared wizard state. This is what actually *connects* the five pages:
 * what you type on Parcel Identification, Owner & Party and Transaction
 * Details is what Review & Submission reads back, and submitting on the
 * Review page is what produces the reference ID shown on Registry Tracking.
 *
 * Every field is seeded with the exact placeholder/`value` the original
 * static HTML shipped with, so an untouched app looks identical to the
 * prototype while still being fully editable.
 *
 * Dates and times are stored as `Date` objects, never as pre-formatted
 * strings. The original state seeded `submittedAt: '31 August 2026, 14:32
 * IST'` and `saveDraft()` wrote `toLocaleTimeString([], …)` — an empty
 * locale array, which asks for the *browser's* locale rather than the app's.
 * Both meant a Hindi reader saw English dates that no formatter could reach.
 * Formatting now happens at render time, from the active locale.
 */

const INITIAL_STATE = {
  transactionId: 'TXN-8492-AX',

  parcel: {
    ulpin: 'ULPIN-8842-1024',
    state: 'Maharashtra',
    district: 'Pune',
    tehsil: 'Haveli',
    village: 'Wagholi',
    surveyNo: '1024',
    plotNo: '42',
    rorRef: 'MH-ROR-2023-891',
    /** Single canonical area. Parcel and Review used to disagree about this. */
    areaAcres: PARCEL_AREA_ACRES,
    landUse: 'agricultural',
  },

  transferee: {
    name: '',
    parentage: '',
    mobile: '',
    email: '',
    address: '',
    idType: '',
    idNumber: '',
  },

  transaction: {
    type: '',
    value: '',
    date: '',
    purpose: '',
    remarks: '',
  },

  documentsUnlocked: false,
  declarationAccepted: false,
  submitted: false,
  applicationId: 'BR-2026-X84Y2Z',
  /** Set to a real Date when the application is submitted; null before that. */
  submittedAt: null,
  draftSavedAt: null,
}

const RegistryContext = createContext(null)

export function RegistryProvider({ children, serviceType = 'sale' }) {
  const [registry, setRegistry] = useState(() => ({
    ...INITIAL_STATE,
    serviceType,
  }))

  /** Patch one field inside one section, e.g. update('parcel', 'village', 'Wagholi'). */
  const update = useCallback((section, field, value) => {
    setRegistry((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))
  }, [])

  /** Patch a top-level flag, e.g. set('documentsUnlocked', true). */
  const set = useCallback((field, value) => {
    setRegistry((prev) => ({ ...prev, [field]: value }))
  }, [])

  const saveDraft = useCallback(() => {
    setRegistry((prev) => ({ ...prev, draftSavedAt: new Date() }))
  }, [])

  /** Called by the Review page's Submit button; feeds the Tracking page. */
  const submit = useCallback(() => {
    setRegistry((prev) => ({
      ...prev,
      submitted: true,
      submittedAt: prev.submittedAt ?? new Date(),
    }))
  }, [])

  const value = useMemo(
    () => ({ registry, update, set, saveDraft, submit }),
    [registry, update, set, saveDraft, submit],
  )

  return <RegistryContext.Provider value={value}>{children}</RegistryContext.Provider>
}

export function useRegistry() {
  const ctx = useContext(RegistryContext)
  if (!ctx) throw new Error('useRegistry must be used inside <RegistryProvider>')
  return ctx
}

/** Show the user's value when they've typed one, otherwise the prototype's sample. */
export function orSample(value, sample) {
  return value === undefined || value === null || value === '' ? sample : value
}
