/**
 * Central route definitions for the Digital Registry wizard.
 *
 * The wizard is mounted under /registry/:serviceType so every Land Service
 * opens the same registry flow with its selected mutation type preserved.
 */
export const REGISTRY_SEGMENT = 'registry'
export const REGISTRY_BASE = `/${REGISTRY_SEGMENT}`

export const SITE_HOME = '/'

export const SERVICE_TYPES = {
  sale: 'sale',
  inheritance: 'inheritance',
  giftPartition: 'gift-partition',
  correction: 'correction',
}

export const SERVICE_LABEL_KEYS = {
  sale: 'pages.landServices.services.sale.title',
  inheritance: 'pages.landServices.services.inheritance.title',
  giftPartition: 'pages.landServices.services.giftPartition.title',
  correction: 'pages.landServices.services.correction.title',
}

export const SERVICE_SLUGS = {
  sale: 'sale',
  inheritance: 'inheritance',
  giftPartition: 'gift-partition',
  correction: 'correction',
}

export const SEGMENTS = {
  parcel: 'parcel-identification',
  owner: 'owner-and-party',
  transaction: 'transaction-documents',
  review: 'review-submission',
  tracking: 'registry-tracking',
}

export const PATHS = Object.fromEntries(
  Object.entries(SEGMENTS).map(([name, segment]) => [
    name,
    `${REGISTRY_BASE}/${segment}`,
  ]),
)

/**
 * Build a service-specific registry URL.
 *
 * Example:
 * /registry/sale/parcel-identification
 */
export const registryServicePath = (serviceType, step) => {
  const serviceSlug = SERVICE_SLUGS[serviceType] ?? serviceType ?? 'sale'
  const segment = SEGMENTS[step] ?? step
  return `${REGISTRY_BASE}/${serviceSlug}/${segment}`
}

export const serviceNavLinks = (serviceType) =>
  Object.entries(SEGMENTS).map(([key]) => ({
    to: registryServicePath(serviceType, key),
    labelKey: `nav.${key}`,
  }))

/**
 * Header navigation is retained for compatibility. Registry Header uses
 * serviceNavLinks() so it preserves the selected Land Service.
 */
export const NAV_LINKS = [
  { to: PATHS.parcel, labelKey: 'nav.parcel' },
  { to: PATHS.owner, labelKey: 'nav.owner' },
  { to: PATHS.transaction, labelKey: 'nav.transaction' },
  { to: PATHS.review, labelKey: 'nav.review' },
  { to: PATHS.tracking, labelKey: 'nav.tracking' },
]

export const WIZARD_STEPS = [
  { n: 1, key: 'parcelLand', segment: 'parcel' },
  { n: 2, key: 'parties', segment: 'owner' },
  { n: 3, key: 'transaction', segment: 'transaction' },
  { n: 4, key: 'documents', segment: 'transaction' },
  { n: 5, key: 'review', segment: 'review' },
  { n: 6, key: 'submit', segment: 'review' },
]

export const TOTAL_STEPS = WIZARD_STEPS.length

export const PAGE_ORDER = [
  SEGMENTS.parcel,
  SEGMENTS.owner,
  SEGMENTS.transaction,
  SEGMENTS.review,
  SEGMENTS.tracking,
]

export const PATH_LABEL_KEYS = {
  [SEGMENTS.parcel]: 'nav.parcel',
  [SEGMENTS.owner]: 'nav.owner',
  [SEGMENTS.transaction]: 'nav.transaction',
  [SEGMENTS.review]: 'nav.review',
  [SEGMENTS.tracking]: 'nav.tracking',
}
