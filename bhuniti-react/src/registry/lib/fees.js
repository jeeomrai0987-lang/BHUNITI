/**
 * Money, fees and land area — the numbers that more than one page shows.
 *
 * Two of them disagreed in the original build:
 *
 *   • Stamp duty. Transaction & Documents used `STAMP_DUTY_RATE = 0.07`
 *     while Review & Submission used 0.06 and labelled it "(6%)". The same
 *     transaction therefore reported two different duties depending on which
 *     page you were standing on.
 *
 *   • Parcel area. Parcel Identification showed "0.85 Acre", Review showed
 *     "0.45 Hectares". 0.85 acre is 0.344 hectare, so neither could be a unit
 *     conversion of the other.
 *
 * Both now come from here, and the percentage in each label is derived from
 * the rate rather than typed next to it, so a label can no longer drift away
 * from the arithmetic it describes.
 */

export const STAMP_DUTY_RATE = 0.06
export const REGISTRATION_FEE_RATE = 0.01
export const CESS_RATE = 0.001

/**
 * Ready-reckoner value as a fraction of the consideration. The original
 * Review page hard-coded `consideration * 0.9444`; keeping the multiplier
 * named at least says what it is.
 */
export const MARKET_VALUE_FACTOR = 0.9444

/** The prototype's sample transaction, used until the user types a value. */
export const SAMPLE_CONSIDERATION = 4_500_000

/** Canonical area of the seeded parcel, stored once in acres. */
export const PARCEL_AREA_ACRES = 0.85
export const ACRE_IN_HECTARES = 0.404686

export const parcelAreaHectares = () => PARCEL_AREA_ACRES * ACRE_IN_HECTARES

/**
 * Turn whatever is in the transaction-value field into a number.
 * An empty or unparseable field falls back to the sample, and — this is the
 * fix for the mismatched-fallback bug — every derived figure is computed
 * from this one result. Previously the value and the duty each fell back
 * independently, so typing `1` displayed a consideration of ₹1 beside a
 * stamp duty of ₹3,15,000.
 */
export function effectiveConsideration(raw) {
  const n = typeof raw === 'number' ? raw : Number.parseFloat(String(raw ?? '').replace(/,/g, ''))
  return Number.isFinite(n) && n > 0 ? n : SAMPLE_CONSIDERATION
}

/** Every fee for one consideration value, plus the rates used to get them. */
export function feeBreakdown(raw) {
  const consideration = effectiveConsideration(raw)
  const stampDuty = consideration * STAMP_DUTY_RATE
  const registration = consideration * REGISTRATION_FEE_RATE
  const cess = consideration * CESS_RATE
  return {
    consideration,
    marketValue: consideration * MARKET_VALUE_FACTOR,
    stampDuty,
    registration,
    cess,
    total: stampDuty + registration + cess,
    rates: {
      stampDuty: STAMP_DUTY_RATE,
      registration: REGISTRATION_FEE_RATE,
      cess: CESS_RATE,
    },
  }
}
