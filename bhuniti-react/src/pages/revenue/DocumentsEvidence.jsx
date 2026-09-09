/*
 * Revenue officer — Document & Evidence Center.
 *
 * Three panes: the repository list on the left, the document viewer in the
 * middle and the OCR cross-check on the right.
 *
 * What the original did wrong. The middle pane always drew the same sale deed
 * no matter which row was clicked, so selecting a document appeared to do
 * nothing; the rows were clickable divs, unreachable by keyboard; the repository
 * badge claimed 1,204 files while three were listed; the type tags were shouted
 * in capitals instead of using the doc_type catalog; the breadcrumb pointed at
 * a placeholder anchor; every icon button carried only a title tooltip; and the
 * deed described a Mumbai parcel while the rest of the build is one Ghaziabad
 * district. The OCR mismatch was likewise hard-coded prose.
 *
 * The evidence now belongs to the open area-mismatch case that the officer
 * dashboard and the discrepancy screen both show, with the same claimed 12.5 ha
 * against a recorded 14.68 ha, and every figure on screen is derived from that
 * one fixture. The list is fetched from /documents and falls back to the fixture
 * with the standard offline notice.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import InterpolatedText from "../../components/InterpolatedText";
import { useI18n } from "../../i18n";
import { MAIN_ROUTES, REVENUE_ROUTES } from "../../routes";
import { api } from "../../services/api";
import { logFallback } from "../../utils/log";

const ULPIN = "09-0824-0014-1026";
const CASE_ID = "DIS-2026-0442";
const MUTATION_ID = "M-2026-018";

// The deed under inspection. Claimed and recorded extents are the case figures,
// so the variance below is arithmetic rather than a sentence.
const DEED = {
  regNo: "A45-992/2026",
  signedOn: "2026-06-12",
  khasra: "413",
  surveyNo: "143/A",
  vendor: { name: "Rajesh Kumar", age: 52 },
  purchaser: { name: "Sunita Devi", age: 41 },
  extractedHa: 12.5,
  recordedHa: 14.68,
  ownerConfidence: 0.998,
  surveyConfidence: 0.985,
};

const DOC_ICON = {
  "Sale Deed": "description",
  "Cadastral Map": "architecture",
  "Court Order": "gavel",
  "Record of Rights": "contract",
  "Survey Report": "straighten",
  "Mutation Order": "assignment_turned_in",
  "Encumbrance Certificate": "verified_user",
  "Identity Proof": "badge",
};

const DOCUMENTS = [
  {
    id: "sale-deed",
    title: "Sale_Deed_A45-992.pdf",
    docType: "Sale Deed",
    at: DEED.signedOn,
    format: "PDF",
    sizeKb: 412,
    // The cross-check failed on the extent, which is why the case exists.
    verified: false,
    link: { kind: "ulpin", value: ULPIN },
    preview: "deed",
  },
  {
    id: "cadastral-map",
    title: "Survey_Map_Khasra413.tiff",
    docType: "Cadastral Map",
    at: "2026-05-28",
    format: "GeoTIFF",
    sizeKb: 2140,
    verified: true,
    link: { kind: "survey", value: DEED.surveyNo },
  },
  {
    id: "court-order",
    title: "Court_Order_2026_0442.pdf",
    docType: "Court Order",
    at: "2026-05-05",
    format: "PDF",
    sizeKb: 286,
    verified: true,
    link: { kind: "case", value: CASE_ID },
  },
];

/* The API returns the stored English doc_type plus a translated sibling; the
   list needs neither an icon nor a link shape, so both are derived here. */
const fromServer = (row) => ({
  id: row.id,
  title: row.title,
  docType: row.doc_type,
  docTypeLabel: row.doc_type_label,
  at: row.created_at,
  format: row.file_format,
  sizeKb: row.file_size_kb,
  verified: row.is_verified !== false,
  fileUrl: row.file_url,
  link: row.ulpin ? { kind: "ulpin", value: row.ulpin } : null,
});

export default function DocumentsEvidence() {
  const { t, label, formatNumber, formatDate, formatArea } = useI18n();
  const p = (key, vars) => t(`pages.documentsEvidence.${key}`, vars);

  const [docs, setDocs] = useState(DOCUMENTS);
  const [offline, setOffline] = useState(false);
  const [selectedId, setSelectedId] = useState(DOCUMENTS[0].id);
  const [typeFilter, setTypeFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [zoom, setZoom] = useState(100);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.documents
      .list(ULPIN)
      .then((rows) => {
        if (cancelled) return;
        const mapped = Array.isArray(rows) ? rows.map(fromServer) : [];
        if (mapped.length) setDocs(mapped);
        setOffline(false);
      })
      .catch((error) => {
        if (cancelled) return;
        logFallback("documents and evidence", error);
        setOffline(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const say = (text) => setToast({ id: Date.now(), text });

  // The chips follow whatever the list actually holds, so a server row with a
  // type the fixture never had still gets a filter.
  const types = useMemo(() => ["all", ...new Set(docs.map((doc) => doc.docType))], [docs]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return docs.filter((doc) => {
      const matchesType = typeFilter === "all" || doc.docType === typeFilter;
      if (!needle) return matchesType;
      const haystack = `${doc.title} ${doc.link?.value ?? ""} ${doc.docType}`.toLowerCase();
      return matchesType && haystack.includes(needle);
    });
  }, [docs, query, typeFilter]);

  // Selecting a row that a later filter hides must not blank the viewer, so the
  // first visible document stands in.
  const selected = visible.find((doc) => doc.id === selectedId) ?? visible[0] ?? null;

  const docLabel = (doc) => label("doc_type", doc.docType, doc.docTypeLabel);

  const linkText = (doc) => {
    if (!doc?.link) return "";
    if (doc.link.kind === "ulpin") return p("repository.linkedUlpin", { ulpin: doc.link.value });
    if (doc.link.kind === "survey") {
      return p("repository.linkedSurvey", {
        field: t("common.fields.surveyNo"),
        number: doc.link.value,
      });
    }
    return p("repository.linkedCase", { id: doc.link.value });
  };

  const percent = (value) =>
    `${formatNumber(value * 100, { maximumFractionDigits: 1 })}${t("common.units.percent")}`;

  const fileSize = (kb) => {
    if (!kb) return formatNumber(null);
    return kb >= 1024
      ? `${formatNumber(kb / 1024, { maximumFractionDigits: 1 })} ${t("common.units.megabyte")}`
      : `${formatNumber(kb)} ${t("common.units.kilobyte")}`;
  };

  const variance = DEED.extractedHa - DEED.recordedHa;
  const isDeed = selected?.preview === "deed";

  const zoomBy = (step) => setZoom((prev) => Math.min(150, Math.max(70, prev + step)));

  const download = (doc) => {
    if (doc?.fileUrl) {
      window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
      return;
    }
    say(p("toast.noFile"));
  };

  const print = (doc) => {
    say(p("toast.printing", { title: doc.title }));
    window.print();
  };

  const khasraOf = (number) =>
    p("deed.boundaries.khasra", { field: t("common.fields.khasra"), number });

  // An OCR-read span is highlighted text, not a control: the original styled it
  // like a button and hid the only explanation in a title tooltip.
  const ocrMark = (text, note, mismatch) => (
    <mark
      className={`inline-flex items-center gap-1.5 border-2 rounded px-2 py-0.5 ${
        mismatch
          ? "border-error bg-error-container text-on-error-container font-bold"
          : "border-primary bg-primary/10 text-on-surface font-semibold"
      }`}
    >
      <span className={mismatch ? "underline decoration-error decoration-2 underline-offset-4" : undefined}>
        {text}
      </span>
      <span
        aria-hidden="true"
        className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
          mismatch ? "bg-error text-on-error" : "bg-primary text-on-primary"
        }`}
      >
        {mismatch ? (
          <span className="material-symbols-outlined text-[11px]">warning</span>
        ) : null}
        {mismatch ? p("deed.mismatchBadge") : p("deed.ocrBadge")}
      </span>
      <span className="sr-only">{note}</span>
    </mark>
  );

  return (
    <main className="relative pt-16 min-h-screen bg-background">
      <nav
        aria-label={t("common.a11y.breadcrumb")}
        className="px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-label-md text-on-surface-variant"
      >
        <Link className="hover:text-primary transition-colors" to={MAIN_ROUTES.home}>
          {t("common.app.name")}
        </Link>
        <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
          chevron_right
        </span>
        <Link className="hover:text-primary transition-colors" to={REVENUE_ROUTES.overview}>
          {t("pages.revenueOverview.breadcrumb")}
        </Link>
        <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
          chevron_right
        </span>
        <span aria-current="page" className="text-on-surface font-semibold">
          {p("breadcrumb")}
        </span>
      </nav>

      <div className="flex flex-col w-full h-full max-w-[1700px] mx-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-on-background">{p("title")}</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
              {p("intro")}
            </p>
            {offline ? (
              <p
                role="status"
                className="mt-3 inline-flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant bg-surface-container-high px-3 py-1.5 rounded-full"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                  cloud_off
                </span>
                {t("common.state.offline")}
              </p>
            ) : null}
          </div>
          {/* The page-level "Filter Records" button opened nothing -- the type
              chips and the search box in the repository are the filter. */}
          <button
            type="button"
            onClick={() => say(p("toast.uploadDialog"))}
            className="bg-primary hover:bg-on-surface text-on-primary font-label-md text-label-md px-5 py-2.5 sm:px-6 sm:py-3 rounded-full flex items-center gap-2 shadow-sm transition-colors self-start"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              upload_file
            </span>
            {p("upload")}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 sm:px-6 lg:px-8 pb-8 items-start">
          <section
            aria-labelledby="repository-heading"
            className="lg:col-span-4 2xl:col-span-3 flex flex-col bg-surface rounded-2xl shadow-sm border border-surface-container-high overflow-hidden"
          >
            <div className="p-4 border-b border-surface-container-high bg-surface-bright flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-primary text-[20px]"
                >
                  folder_open
                </span>
                <h2
                  id="repository-heading"
                  className="font-headline-md text-headline-md text-on-surface"
                >
                  {p("repository.heading")}
                </h2>
              </div>
              {/* The badge used to read 1,204 above a list of three. */}
              <span className="bg-surface-container-high text-on-surface-variant font-tabular-nums text-tabular-nums px-2.5 py-1 rounded-full text-xs font-semibold">
                <span aria-hidden="true">{formatNumber(visible.length)}</span>
                <span className="sr-only">
                  {t("common.state.resultCount", { count: visible.length })}
                </span>
              </span>
            </div>

            <div className="p-4 bg-surface-bright border-b border-surface-container-highest space-y-3">
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px]"
                >
                  search
                </span>
                <label className="sr-only" htmlFor="document-search">
                  {p("repository.search")}
                </label>
                <input
                  id="document-search"
                  className="w-full bg-surface pl-10 pr-4 py-2.5 rounded-lg border border-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-sm text-body-sm text-on-surface transition-all placeholder:text-on-surface-variant/60"
                  placeholder={p("repository.search")}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div
                role="group"
                aria-label={p("repository.filterLabel")}
                className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
              >
                {types.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={typeFilter === value}
                    onClick={() => setTypeFilter(value)}
                    className={`whitespace-nowrap font-label-md text-label-md px-3 py-1.5 rounded-md flex-shrink-0 transition-colors ${
                      typeFilter === value
                        ? "bg-secondary-container text-on-secondary-container shadow-sm border border-secondary-fixed/50"
                        : "bg-surface hover:bg-surface-container text-on-surface-variant border border-outline-variant/30"
                    }`}
                  >
                    {value === "all" ? p("repository.allTypes") : label("doc_type", value)}
                  </button>
                ))}
              </div>
            </div>
            <ul className="overflow-y-auto max-h-[520px] 2xl:max-h-[calc(100vh-320px)] divide-y divide-surface-container-highest">
              {visible.length > 0 ? (
                visible.map((doc) => {
                  const isSelected = selected?.id === doc.id;
                  return (
                    <li key={doc.id}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        aria-label={p("repository.rowSummary", {
                          title: doc.title,
                          type: docLabel(doc),
                          date: formatDate(doc.at),
                          link: linkText(doc),
                        })}
                        onClick={() => setSelectedId(doc.id)}
                        className={`w-full text-left p-4 transition-colors border-l-4 ${
                          isSelected
                            ? "border-l-primary bg-primary-fixed/30"
                            : "border-l-transparent hover:bg-surface-container-low"
                        }`}
                      >
                        <span className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? "bg-surface text-primary shadow-sm border border-outline-variant/20"
                                : "bg-surface-container-high text-on-surface-variant"
                            }`}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={isSelected ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >
                              {DOC_ICON[doc.docType] ?? "description"}
                            </span>
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="flex justify-between items-start mb-1 gap-1">
                              <span className="font-headline-md text-body-lg font-semibold text-on-surface truncate">
                                {doc.title}
                              </span>
                              <span
                                aria-hidden="true"
                                className={`material-symbols-outlined text-[16px] flex-shrink-0 ${
                                  doc.verified ? "text-primary" : "text-error"
                                }`}
                              >
                                {doc.verified ? "check_circle" : "warning"}
                              </span>
                            </span>
                            <span className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="bg-surface text-on-surface-variant font-label-md text-[10px] px-1.5 py-0.5 rounded border border-outline-variant/40">
                                {docLabel(doc)}
                              </span>
                              <span className="font-tabular-nums text-label-md text-on-surface-variant">
                                {formatDate(doc.at)}
                              </span>
                            </span>
                            <span className="block font-body-sm text-body-sm text-on-surface-variant truncate">
                              {linkText(doc)}
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })
              ) : (
                <li className="p-8 text-center text-on-surface-variant font-body-sm">
                  <p className="text-on-surface font-semibold">{p("repository.empty")}</p>
                  <p className="mt-1">{p("repository.emptyHint")}</p>
                </li>
              )}
            </ul>

          </section>
          <section
            aria-labelledby="viewer-heading"
            className="lg:col-span-8 2xl:col-span-6 flex flex-col bg-surface-bright rounded-2xl shadow-sm border border-surface-container-high overflow-hidden relative min-h-[600px]"
          >
            <div className="min-h-16 py-3 border-b border-surface-container-highest bg-surface/90 backdrop-blur-md flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-6 gap-3 z-20">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined text-on-surface-variant bg-surface-container p-2 rounded-lg flex-shrink-0"
                >
                  {selected ? DOC_ICON[selected.docType] ?? "description" : "description"}
                </span>
                <div className="min-w-0">
                  <h2
                    id="viewer-heading"
                    className="font-headline-md text-base sm:text-headline-md text-on-surface font-semibold truncate sm:whitespace-normal"
                  >
                    {selected
                      ? p("viewer.heading", { type: docLabel(selected), title: selected.title })
                      : p("repository.empty")}
                  </h2>
                  {selected ? (
                    <p className="flex items-center gap-2 mt-0.5">
                      <span
                        aria-hidden="true"
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          selected.verified ? "bg-primary" : "bg-error animate-pulse"
                        }`}
                      />
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        {selected.verified ? p("viewer.clean") : p("viewer.alert")}
                      </span>
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  type="button"
                  aria-label={p("viewer.zoomIn")}
                  onClick={() => zoomBy(10)}
                  className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                    zoom_in
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={p("viewer.zoomOut")}
                  onClick={() => zoomBy(-10)}
                  className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                    zoom_out
                  </span>
                </button>
                {zoom !== 100 ? (
                  <button
                    type="button"
                    aria-label={p("viewer.zoomReset")}
                    onClick={() => setZoom(100)}
                    className="text-xs px-2 py-1 bg-surface-container text-on-surface rounded font-tabular-nums hover:bg-surface-container-high"
                  >
                    {percent(zoom / 100)}
                  </button>
                ) : null}
                <button
                  type="button"
                  aria-label={p("viewer.download")}
                  onClick={() => download(selected)}
                  className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                    download
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={p("viewer.print")}
                  onClick={() => selected && print(selected)}
                  className="w-9 h-9 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                    print
                  </span>
                </button>
              </div>
            </div>
            <div className="flex-1 bg-surface-container-low overflow-auto relative p-4 sm:p-6 md:p-8 flex items-start justify-center max-h-[700px] 2xl:max-h-[calc(100vh-320px)]">
              {isDeed ? (
                <article
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: "top center",
                    transition: "transform 0.15s ease-out",
                  }}
                  className="w-full max-w-[760px] bg-white shadow-xl min-h-[850px] p-6 sm:p-10 md:p-12 relative mx-auto rounded-lg border border-outline-variant/20"
                >
                  <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-on-surface/20 pb-4 mb-8 gap-3">
                    <div>
                      <h3 className="font-display text-headline-lg text-on-surface font-bold uppercase tracking-widest">
                        {p("deed.kind")}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        {p("deed.subtitle")}
                      </p>
                    </div>
                    <dl className="sm:text-right font-tabular-nums text-body-sm text-on-surface-variant">
                      <div className="flex gap-1 sm:justify-end">
                        <dt>{p("deed.regNo")}</dt>
                        <dd className="text-on-surface font-semibold">{DEED.regNo}</dd>
                      </div>
                      <div className="flex gap-1 sm:justify-end">
                        <dt>{t("common.fields.registeredOn")}</dt>
                        <dd className="text-on-surface font-semibold">
                          {formatDate(DEED.signedOn)}
                        </dd>
                      </div>
                    </dl>
                  </header>

                  <div className="space-y-6 font-body-lg text-body-lg text-on-surface/80 leading-relaxed max-w-prose">
                    <p>
                      {p("deed.executed", {
                        office: p("deed.office"),
                        date: formatDate(DEED.signedOn, { dateStyle: "long" }),
                      })}
                    </p>
                    <p>
                      <strong>{p("deed.between")}</strong>
                      <br />
                      <InterpolatedText
                        template={p("deed.party", {
                          age: formatNumber(DEED.vendor.age),
                          address: p("deed.vendorAddress"),
                          role: p("deed.vendorRole"),
                        })}
                        values={{
                          name: ocrMark(
                            DEED.vendor.name,
                            p("deed.ocrMatch", { confidence: percent(DEED.ownerConfidence) }),
                            false
                          ),
                        }}
                      />
                    </p>
                    <p>
                      <strong>{p("deed.and")}</strong>
                      <br />
                      {p("deed.party", {
                        name: DEED.purchaser.name,
                        age: formatNumber(DEED.purchaser.age),
                        address: p("deed.purchaserAddress"),
                        role: p("deed.purchaserRole"),
                      })}
                    </p>
                    <p>
                      <strong>{p("deed.schedule")}</strong>
                      <br />
                      <InterpolatedText
                        template={p("deed.scheduleText", {
                          field: t("common.fields.surveyNo"),
                          ulpin: ULPIN,
                          village: t("common.place.village"),
                          tehsil: t("common.place.tehsil"),
                        })}
                        values={{
                          number: ocrMark(
                            DEED.surveyNo,
                            p("deed.ocrMatch", {
                              confidence: percent(DEED.surveyConfidence),
                            }),
                            false
                          ),
                        }}
                      />
                    </p>
                    <p>
                      <InterpolatedText
                        template={p("deed.extent")}
                        values={{
                          area: ocrMark(
                            formatArea(DEED.extractedHa),
                            p("deed.ocrMismatch", {
                              extracted: formatArea(DEED.extractedHa),
                              recorded: formatArea(DEED.recordedHa),
                            }),
                            true
                          ),
                        }}
                      />
                    </p>
                    <ul className="list-disc pl-8 space-y-2 text-body-md text-on-surface-variant">
                      <li>{p("deed.boundaries.north", { value: khasraOf("412") })}</li>
                      <li>
                        {p("deed.boundaries.south", { value: p("deed.boundaries.publicRoad") })}
                      </li>
                      <li>{p("deed.boundaries.east", { value: p("deed.boundaries.canal") })}</li>
                      <li>{p("deed.boundaries.west", { value: khasraOf("414") })}</li>
                    </ul>

                  </div>
                  <footer className="mt-12 sm:mt-16 text-right flex flex-col items-end">
                    {/* Not a control -- the original gave the stamp a pointer
                        cursor and a hover state it could not honour. */}
                    <div className="w-48 h-24 border-2 border-dashed border-primary/50 bg-primary/5 rounded-lg flex flex-col items-center justify-center rotate-[-1deg] p-2">
                      <p className="font-display text-headline-md text-primary/70 italic font-semibold">
                        {p("deed.stamp")}
                      </p>
                      <p className="mt-1 text-[10px] bg-primary text-on-primary font-medium px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <span aria-hidden="true" className="material-symbols-outlined text-[11px]">
                          verified
                        </span>
                        {p("deed.stampVerified")}
                      </p>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 text-center w-48 font-medium">
                      {p("deed.signatory")}
                    </p>
                  </footer>

                </article>
              ) : selected ? (
                <div className="w-full max-w-[560px] mx-auto bg-surface rounded-xl border border-outline-variant/30 p-8 shadow-sm text-center">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[40px] text-on-surface-variant"
                  >
                    {DOC_ICON[selected.docType] ?? "description"}
                  </span>
                  <h3 className="mt-3 font-headline-md text-headline-md text-on-surface">
                    {p("viewer.noPreview")}
                  </h3>
                  <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                    {p("viewer.noPreviewHint")}
                  </p>
                  <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <div>
                      <dt className="font-label-md text-label-md text-on-surface-variant">
                        {t("common.fields.documentType")}
                      </dt>
                      <dd className="font-body-md text-body-md text-on-surface">
                        {docLabel(selected)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-label-md text-label-md text-on-surface-variant">
                        {t("common.fields.fileName")}
                      </dt>
                      <dd className="font-body-md text-body-md text-on-surface break-all">
                        {selected.title}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-label-md text-label-md text-on-surface-variant">
                        {t("common.fields.fileSize")}
                      </dt>
                      <dd className="font-tabular-nums text-body-md text-on-surface">
                        {fileSize(selected.sizeKb)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-label-md text-label-md text-on-surface-variant">
                        {t("common.fields.uploadedOn")}
                      </dt>
                      <dd className="font-body-md text-body-md text-on-surface">
                        {formatDate(selected.at)}
                      </dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => download(selected)}
                    className="mt-6 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-5 py-2.5 rounded-full inline-flex items-center gap-2 transition-colors"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                      download
                    </span>
                    {t("common.actions.download")}
                  </button>
                </div>
              ) : (
                <p className="m-auto font-body-md text-body-md text-on-surface-variant">
                  {p("repository.empty")}
                </p>
              )}
            </div>

          </section>
          <section
            aria-labelledby="ocr-heading"
            className="lg:col-span-12 2xl:col-span-3 flex flex-col bg-surface rounded-2xl shadow-sm border border-surface-container-high overflow-hidden z-30"
          >
            <div className="p-4 sm:p-6 border-b border-surface-container-high bg-surface-bright flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="material-symbols-outlined text-primary">
                  document_scanner
                </span>
                <h2 id="ocr-heading" className="font-headline-md text-headline-md text-on-surface">
                  {p("ocr.heading")}
                </h2>
              </div>
              <p
                className={`px-3 py-1 rounded-full font-label-md text-label-md flex items-center gap-1.5 shadow-sm flex-shrink-0 ${
                  isDeed
                    ? "bg-error-container text-on-error-container"
                    : "bg-secondary/10 text-secondary"
                }`}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                  {isDeed ? "gavel" : "check_circle"}
                </span>
                {isDeed ? p("ocr.chipDiscrepancy") : p("ocr.chipClean")}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-surface max-h-[520px] 2xl:max-h-[calc(100vh-380px)]">
              {isDeed ? (
                <>
                  <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/20 shadow-sm leading-relaxed">
                    {p("ocr.intro", { ulpin: ULPIN })}
                  </p>
                  {[
                    { key: "owner", value: DEED.vendor.name, confidence: DEED.ownerConfidence },
                    {
                      key: "surveyNumber",
                      value: DEED.surveyNo,
                      confidence: DEED.surveyConfidence,
                    },
                  ].map((field) => (
                    <div key={field.key}>
                      <div className="flex justify-between items-center mb-2 gap-2">
                        <h3 className="font-label-md text-label-md text-on-surface-variant">
                          {p(`ocr.${field.key}`)}
                        </h3>
                        <p className="flex items-center gap-1 text-primary bg-primary-fixed/50 px-2 py-0.5 rounded font-label-md text-[10px]">
                          <span aria-hidden="true" className="material-symbols-outlined text-[12px]">
                            verified
                          </span>
                          {p("ocr.matches")}
                        </p>
                      </div>
                      <div className="bg-surface-bright border border-surface-container-highest rounded-xl p-4 shadow-sm">
                        <p className="font-headline-md text-headline-md text-on-surface mb-1">
                          {field.value}
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
                          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {p("ocr.confidence", { value: percent(field.confidence) })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div>
                    <div className="flex justify-between items-center mb-2 gap-2">
                      <h3 className="font-label-md text-label-md text-error font-bold">
                        {p("ocr.totalArea")}
                      </h3>
                      <p className="flex items-center gap-1 text-on-error-container bg-error-container px-2 py-0.5 rounded font-label-md text-[10px] shadow-sm">
                        <span aria-hidden="true" className="material-symbols-outlined text-[12px]">
                          warning
                        </span>
                        {p("ocr.mismatch")}
                      </p>
                    </div>
                    <dl className="bg-error-container/10 border-2 border-error/40 rounded-xl shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-error/20 bg-surface-bright">
                        <dt className="font-label-md text-label-md text-on-surface-variant mb-1 flex items-center gap-2">
                          <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                            description
                          </span>
                          {p("ocr.extracted")}
                        </dt>
                        <dd className="font-headline-md text-headline-md text-error font-bold">
                          {formatArea(DEED.extractedHa)}
                        </dd>
                      </div>
                      <div className="p-4 bg-surface-container-lowest">
                        <dt className="font-label-md text-label-md text-on-surface-variant mb-1 flex items-center gap-2">
                          <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                            database
                          </span>
                          {p("ocr.registry")}
                        </dt>
                        <dd className="font-headline-md text-headline-md text-on-surface">
                          {formatArea(DEED.recordedHa)}
                        </dd>
                      </div>
                    </dl>
                    {/* The variance was prose reading "+0.2 Hectares"; it is now
                        the difference between the two figures above. */}
                    <p className="mt-3 text-body-sm font-body-sm text-on-surface-variant bg-surface p-2 rounded border border-outline-variant/30 flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[16px] text-primary mt-0.5 flex-shrink-0"
                      >
                        info
                      </span>
                      <span>
                        {p("ocr.variance", {
                          difference: formatArea(variance),
                          mutation: MUTATION_ID,
                        })}
                      </span>
                    </p>
                  </div>


                </>
              ) : (
                <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/20 leading-relaxed">
                  {p("ocr.none")}
                </p>
              )}
            </div>
            {isDeed ? (
              <div className="p-4 sm:p-6 border-t border-surface-container-highest bg-surface-bright flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => say(p("toast.flagged", { id: CASE_ID }))}
                  className="w-full bg-primary hover:bg-on-surface text-on-primary font-label-md text-label-md py-3.5 rounded-xl shadow-md transition-all flex justify-center items-center gap-2"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                    flag
                  </span>
                  {p("ocr.flagSurvey")}
                </button>
                <button
                  type="button"
                  onClick={() => say(p("toast.overridden", { id: CASE_ID }))}
                  className="w-full bg-surface hover:bg-surface-container border-2 border-outline-variant/50 text-on-surface font-label-md text-label-md py-3 rounded-xl transition-all"
                >
                  {p("ocr.override")}
                </button>
              </div>
            ) : null}

          </section>



        </div>
      </div>

      {/* Mounted at all times so the region is announced when text arrives. */}
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-4 right-4 z-[70] pointer-events-none"
      >
        {toast ? (
          <p className="max-w-xs bg-inverse-surface text-inverse-on-surface rounded-xl shadow-lg px-4 py-3 font-body-md text-[12px] leading-snug">
            {toast.text}
          </p>
        ) : null}
      </div>
    </main>
  );
}
