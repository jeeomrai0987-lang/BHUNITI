/*
 * English strings for src/pages/revenue/GisExplorer.jsx -- the officer's
 * spatial search and 360° inspection screen.
 *
 * Reached from a component as t("pages.gisExplorer....").
 */

const gisExplorer = {
  header: {
    portal: "Revenue Officer",
    title: "GIS Explorer & 360° Inspection",
    // The chip next to the breadcrumb: the spatial database is answering.
    postgis: "PostGIS cloud active",
    openSearch: "Search & roster",
    closeSearch: "Close search",
  },

  search: {
    heading: "Spatial land search",
    hint: "Query cadastral parcels by ULPIN / Khasra",
    label: "Universal Land PIN (ULPIN) / Khasra",
    placeholder: "e.g. 1024, 412/1, P-1026",
    submit: "Locate on GIS map",
    close: "Close the search panel",
  },

  roster: {
    // The heading names the village whose parcels are listed.
    heading: "Quick cadastral roster ({{village}})",
    // The khasra number as the roster prints it, abbreviated.
    khasra: "K. {{number}}",
    // Each row is a button; this is what it announces.
    select: "Show parcel {{khasra}} ({{owner}}) on the map",
  },

  hint: "Tap any parcel polygon to open the 360° ground inspection",
};

export default gisExplorer;
