/*
 * English strings for src/pages/revenue/DocumentsEvidence.jsx -- the evidence
 * repository, the document viewer and the OCR cross-check panel.
 *
 * The document types shown here are domain values (domain.doc_type), so the
 * repository tags are not repeated in this file; the tags used to be shouted in
 * capitals ("SALE DEED") which no other screen does and the API never returns.
 *
 * The deed facsimile is demo evidence for the one open area-mismatch case, so
 * its party names and figures are fixture data passed in as placeholders rather
 * than sentences baked into the copy -- the same case appears on the officer
 * dashboard and the discrepancy screen with the same numbers.
 *
 * Reached from a component as t("pages.documentsEvidence....").
 */

const documentsEvidence = {
  breadcrumb: "Documents & Evidence",
  title: "Document & Evidence Center",
  intro:
    "Secure repository for legal instruments, survey records and registration documents. Every uploaded artefact is cross-checked against the master land registry by automated OCR extraction.",
  upload: "Upload Evidence",

  repository: {
    heading: "Repository",
    search: "Search by file name or reference",
    filterLabel: "Filter by document type",
    allTypes: "All Types",
    empty: "No documents match this filter.",
    emptyHint: "Clear the search box or choose another document type.",
    // Each row is a button, so its four parts become its accessible name.
    rowSummary: "{{title}} — {{type}}, {{date}}, {{link}}",
    mismatch: "Mismatch detected",
    verified: "Cross-check passed",
    linkedUlpin: "Linked to ULPIN {{ulpin}}",
    linkedSurvey: "Linked to {{field}} {{number}}",
    linkedCase: "Linked to case {{id}}",
  },

  viewer: {
    heading: "{{type}}: {{title}}",
    alert: "Verification alert",
    clean: "Cross-check passed",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    zoomReset: "Reset zoom to 100%",
    zoomLevel: "Zoom {{level}}",
    download: "Download the original file",
    print: "Print this document",
    // Only the deed is reproduced in the demo build; the others are a GeoTIFF
    // and a scan, so the pane states what it holds instead of showing the deed
    // again for every row.
    noPreview: "No inline preview for this file",
    noPreviewHint: "Download the original to inspect it in a viewer of your choice.",
  },

  deed: {
    kind: "Deed of Absolute Sale",
    subtitle: "Instrument of transfer",
    regNo: "Reg. No.",
    office: "Sub-Registrar Office, Modinagar",
    executed: "This deed of absolute sale was executed at {{office}} on {{date}}.",
    between: "BETWEEN",
    party: "{{name}}, aged {{age}} years, resident of {{address}}, hereinafter called the {{role}}.",
    vendorRole: "VENDOR",
    vendorAddress: "House 14, Sikandrabad, Modinagar",
    purchaserRole: "PURCHASER",
    purchaserAddress: "Plot 8, Kadrabad Road, Modinagar",
    and: "AND",
    schedule: "SCHEDULE OF PROPERTY",
    scheduleText:
      "All that piece and parcel of land bearing {{field}} {{number}}, corresponding to ULPIN {{ulpin}}, situated in the revenue village of {{village}}, tehsil {{tehsil}}.",
    extent: "The total extent of the aforementioned property is {{area}}, bounded as follows:",
    ocrBadge: "OCR",
    mismatchBadge: "Mismatch",
    ocrMatch: "Read by OCR, matches the registry at {{confidence}} confidence.",
    ocrMismatch: "Read by OCR as {{extracted}} against {{recorded}} in the registry.",
    boundaries: {
      heading: "Boundaries",
      north: "North: {{value}}",
      south: "South: {{value}}",
      east: "East: {{value}}",
      west: "West: {{value}}",
      khasra: "{{field}} {{number}}",
      publicRoad: "Public road",
      canal: "Irrigation canal",
    },
    stamp: "Signature / Stamp",
    stampVerified: "Stamp verified",
    signatory: "Authorised signatory",
  },

  ocr: {
    heading: "OCR Extraction",
    chipDiscrepancy: "Discrepancy",
    chipClean: "All fields match",
    intro:
      "Fields were extracted by the vision model and cross-checked against master land registry records for ULPIN {{ulpin}}.",
    matches: "Matches registry",
    mismatch: "Mismatch detected",
    confidence: "Confidence {{value}}",
    owner: "Current owner",
    surveyNumber: "Survey number",
    totalArea: "Total area",
    extracted: "Read from the document",
    registry: "Master land registry",
    variance:
      "A difference of {{difference}} against the registry. A surveyor must verify the boundary before mutation {{mutation}} can be approved.",
    none: "This file carries no extracted fields, so there is nothing to cross-check.",
    flagSurvey: "Flag for physical survey",
    override: "Override and accept the document value",
  },

  toast: {
    uploadDialog: "The upload dialog opens here in the full build.",
    noFile: "No original file is attached to this record in the sample data.",
    printing: "Sending {{title}} to your printer.",
    flagged: "Case {{id}} flagged for a physical survey.",
    overridden: "Document value accepted for {{id}} — a fresh mutation order is now required.",
  },
};

export default documentsEvidence;
