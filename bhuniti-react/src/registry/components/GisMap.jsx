import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { useI18n } from '../i18n/index.jsx'

// Leaflet resolves its default marker images relative to the stylesheet, which
// breaks once the CSS is bundled. Point it at the hashed asset URLs instead.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const CENTER = [18.5795, 73.909]
const SELECTED = [18.5817, 73.9065]

/**
 * The four demo parcels, straight from the original script — except the
 * popup fields are now data rather than prose. `area` was the string
 * "0.85 Acre" with the unit welded on, `use` was "Agricultural" and `status`
 * was "Verified", none of which could be translated. They are now a number
 * plus two catalog keys.
 */
const PARCELS = [
  {
    id: 'P-1024',
    ring: [
      [18.583, 73.905],
      [18.583, 73.908],
      [18.5805, 73.908],
      [18.5805, 73.905],
    ],
    style: { color: '#0058be', weight: 2, fillColor: '#2170e4', fillOpacity: 0.25 },
    popup: {
      ulpin: 'ULPIN-8842-1024',
      khasra: '1024',
      areaAcres: 0.85,
      useKey: 'landUse.agricultural',
      statusKey: 'status.verified',
    },
    highlightOnClick: true,
  },
  {
    id: 'P-1025',
    ring: [
      [18.583, 73.9082],
      [18.583, 73.9115],
      [18.5805, 73.9115],
      [18.5805, 73.9082],
    ],
    style: { color: '#10b981', weight: 2, fillColor: '#10b981', fillOpacity: 0.2 },
    popup: {
      ulpin: 'ULPIN-8842-1025',
      khasra: '1025',
      areaAcres: 1.2,
      useKey: 'landUse.residential',
      statusKey: 'status.reconciled',
    },
  },
  {
    id: 'P-1026',
    ring: [
      [18.5803, 73.905],
      [18.5803, 73.908],
      [18.5775, 73.908],
      [18.5775, 73.905],
    ],
    style: { color: '#f59e0b', weight: 2, fillColor: '#f59e0b', fillOpacity: 0.2 },
    popup: {
      ulpin: 'ULPIN-8842-1026',
      khasra: '1026',
      areaAcres: 0.72,
      useKey: 'landUse.agricultural',
      statusKey: 'status.pending',
    },
  },
  {
    id: 'P-1027',
    ring: [
      [18.5803, 73.9082],
      [18.5803, 73.9115],
      [18.5775, 73.9115],
      [18.5775, 73.9082],
    ],
    style: { color: '#0058be', weight: 2, fillColor: '#2170e4', fillOpacity: 0.2 },
    popup: {
      ulpin: 'ULPIN-8842-1027',
      khasra: '1027',
      areaAcres: 1.05,
      useKey: 'landUse.residential',
      statusKey: 'status.verified',
    },
  },
]

const HIGHLIGHT = { weight: 4, fillOpacity: 0.45 }

const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )

/** `<p><b>label:</b> value</p>`, with both sides escaped. */
const row = (label, value) => `<p><b>${escapeHtml(label)}:</b> ${escapeHtml(value)}</p>`

const popupHtml = (title, rows) =>
  `<div class="parcel-popup"><h4>${escapeHtml(title)}</h4>${rows.join('')}</div>`

/**
 * The interactive Leaflet map from Parcel Identification.html.
 *
 * The original called `map.zoomIn()` etc. from inline `onclick` handlers on a
 * global `map` variable. Here the instance is owned by this component and the
 * parent drives it through a ref: `mapRef.current.zoomIn()` / `.locate()`.
 */
const GisMap = forwardRef(function GisMap({ ulpin, village, surveyNo }, ref) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)
  /** Kept so popups can be re-bound in the new language without rebuilding the map. */
  const polysRef = useRef([])
  const { t, locale, formatDecimal } = useI18n()

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    const map = L.map(containerRef.current, { zoomControl: false }).setView(CENTER, 14)
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    polysRef.current = PARCELS.map((parcel) => {
      const poly = L.polygon(parcel.ring, parcel.style).addTo(map)
      if (parcel.highlightOnClick) {
        // The original set the thicker style and never put it back, so the
        // first parcel stayed emphasised for the rest of the session even
        // after you clicked elsewhere. Now every other parcel is reset first.
        poly.on('click', () => {
          polysRef.current.forEach(({ poly: other, base }) => other.setStyle(base))
          poly.setStyle({ ...parcel.style, ...HIGHLIGHT })
        })
      }
      return { poly, base: parcel.style, parcel }
    })

    // The marker was added with no `bindPopup`, which made the popup content
    // set below — and `openPopup()` in locate() — silent no-ops: the popup
    // for the parcel you are actually registering could never open. Binding
    // it here is what makes both work.
    markerRef.current = L.marker(SELECTED).addTo(map).bindPopup('')

    // The original also had a `map.on('click')` handler that only wrote the
    // clicked coordinates to the console. Removed rather than kept as noise.

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
      polysRef.current = []
    }
  }, [])

  // Parcel popups are rebuilt whenever the language changes. They used to be
  // bound once inside the mount effect, so after switching to Hindi every
  // parcel still opened an English popup.
  useEffect(() => {
    const areaOf = (acres) => `${formatDecimal(acres)} ${t('units.acre')}`
    polysRef.current.forEach(({ poly, parcel }) => {
      const p = parcel.popup
      poly.bindPopup(
        popupHtml(t('map.parcelTitle', { id: parcel.id }), [
          row(t('map.popup.ulpin'), p.ulpin),
          row(t('map.popup.khasra'), p.khasra),
          row(t('map.popup.area'), areaOf(p.areaAcres)),
          row(t('map.popup.landUse'), t(p.useKey)),
          row(t('map.popup.status'), t(p.statusKey)),
        ]),
      )
    })
  }, [locale, t, formatDecimal])

  // Keep the marker popup in sync with whatever is typed into the form.
  useEffect(() => {
    if (!markerRef.current) return
    const dash = t('notAvailable')
    markerRef.current.setPopupContent(
      popupHtml(t('map.selectedTitle'), [
        row(t('map.popup.ulpin'), ulpin || dash),
        row(t('map.popup.surveyNo'), surveyNo || dash),
        row(t('map.popup.village'), village || dash),
        row(t('map.popup.status'), t('status.verifiedCaps')),
      ]),
    )
  }, [ulpin, village, surveyNo, locale, t])

  useImperativeHandle(ref, () => ({
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
    locate: () => {
      mapRef.current?.setView(SELECTED, 16, { animate: true })
      markerRef.current?.openPopup()
    },
  }))

  // The bare <div> had no role and no name, so the map was an unlabelled
  // region that a screen reader announced as nothing at all.
  return (
    <div aria-label={t('map.regionLabel')} id="gisMap" ref={containerRef} role="application" />
  )
})

export default GisMap
