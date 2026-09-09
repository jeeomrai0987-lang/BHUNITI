/*
 * English strings for src/pages/admin/ReconciliationMonitor.jsx -- the critical
 * discrepancy banner, the system-pair matrix, the hotspot map and the AI anomaly
 * feed.
 *
 * The anomaly bodies are templates rather than finished sentences so the areas,
 * counts and land-use labels inside them are formatted for the active locale
 * instead of being frozen as English text.
 *
 * Reached from a component as t("pages.reconciliationMonitor....").
 */

const reconciliationMonitor = {
  title: "Reconciliation Monitor",
  intro:
    "Real-time monitoring of cross-system data fidelity. Current focus on elevated discrepancy rates detected between legacy land registries and satellite GIS vectors.",

  sync: {
    status: "Sync Status",
    warning: "Warning",
    lastRun: "Last Run",
    lastRunValue: "{{day}}, {{time}}",
    forceSync: "Force Sync",
  },

  critical: {
    badge: "Critical Discrepancy",
    heading: "Land Records vs. GIS Vector",
    body:
      "The spatial footprint in the District GIS does not match the registered boundary definitions in the Bhulekh registry. The variance exceeds the acceptable {{threshold}} threshold.",
    affectedParcels: "Affected Parcels",
    mismatchRate: "Mismatch Rate",
    match: "Match",
    donutCaption: "{{value}} of parcels agree across both systems",
  },

  matrix: {
    heading: "System Pair Reconciliation Matrix",
    // The two system names sit either side of a sync icon, so the pair reads as
    // one label to a screen reader.
    pair: "{{left}} ↔ {{right}}",
    agreement: "{{value}} agreement",
    // `count` is passed alongside `value` purely to pick the plural form -- the
    // visible number comes from `value` because a raw {{count}} would be
    // stringified without the locale's thousands separator.
    mismatches_one: "{{value}} mismatch",
    mismatches_other: "{{value}} mismatches",
    intervention: "{{mismatches}} — requires intervention",
    viewAudit: "View Audit",
    viewAuditFor: "View the audit for {{pair}}",
    resolve: "Resolve Discrepancies",
    resolveFor: "Resolve discrepancies for {{pair}}",
    systems: {
      registry: "REGISTRY",
      survey: "SURVEY",
      census: "CENSUS",
      landRecords: "LAND RECORDS",
      gisDb: "GIS DB",
    },
  },

  hotspot: {
    label: "Hotspot: Tehsil {{tehsil}}",
    // The systemic cluster anomaly below describes this same hotspot, so both
    // read the village from one string rather than naming it twice.
    village: "Behta Hajipur",
    caption: "Satellite view of the tehsil with the current discrepancy hotspot",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
  },

  anomalies: {
    heading: "AI Flagged Anomalies",
    live: "Live",
    ulpin: "ULPIN: {{value}}",
    multiple: "MULTIPLE ({{count}})",
    open: "Open the anomaly for {{subject}}",
    viewFullLog: "View Full AI Audit Log",
    risk: {
      high: "High Risk",
      medium: "Medium Risk",
      systemic: "Systemic",
    },
    tags: {
      boundary: "Boundary",
      attribute: "Attribute",
      spatial: "Spatial",
      classification: "Classification",
    },
    body: {
      areaDiscrepancy:
        "Area discrepancy. The registry states {{registry}}; the GIS polygon measures {{gis}}. Possible encroachment or a subdivision mapping failure.",
      ownershipNull:
        "Ownership is null in the GIS attributes. The registry indicates joint ownership by {{parties}}.",
      clusterShift:
        "Cluster geometry shift detected in village {{village}}. Polygons are translated roughly {{shift}} east of the historical survey baseline.",
      landUseMismatch:
        "Land use category mismatch. Registry: {{registry}}. GIS: {{gis}}. Field verification recommended.",
    },
    parties_one: "{{count}} party",
    parties_other: "{{count}} parties",
    metres: "{{count}} m",
  },
};

export default reconciliationMonitor;
