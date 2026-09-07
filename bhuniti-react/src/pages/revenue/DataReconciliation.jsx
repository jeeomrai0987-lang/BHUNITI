import { useI18n } from "../../i18n";
import InterpolatedText from "../../components/InterpolatedText";

/*
 * One row of the multi-source comparison. `label` is a full dotted catalog key
 * so a row can reuse a shared field name (common.fields.surveyNo) or a
 * page-specific one. Cell values are either raw registry data (owner name,
 * survey number), a number the page formats, a `valueKey` naming a catalog
 * string ("N/A", "Valid Geometry"), or a domain value run through label().
 */
const ATTRIBUTES = [
  {
    id: "owner",
    label: "pages.dataReconciliation.comparison.attributes.primaryOwner",
    cells: [
      { text: "Rajesh Kumar" },
      { valueKey: "notAvailable", muted: true },
      { text: "Rajesh Kumar" },
      { valueKey: "notAvailable", muted: true },
    ],
    status: "match",
  },
  {
    id: "area",
    label: "pages.dataReconciliation.comparison.attributes.totalArea",
    flagged: true,
    cells: [
      { hectares: 2, className: "font-bold" },
      { hectares: 2.18, className: "font-bold text-error" },
      { hectares: 2 },
      { hectares: 2.17, className: "font-bold text-error" },
    ],
    status: "mismatch",
  },
  {
    id: "survey-no",
    label: "common.fields.surveyNo",
    cells: [{ text: "45/2B" }, { text: "45/2B" }, { text: "45/2B" }, { text: "45/2B" }],
    status: "match",
  },
  {
    id: "land-use",
    label: "common.fields.landUse",
    cells: [
      { domain: ["land_type", "Agricultural"] },
      { domain: ["land_type", "Agricultural"] },
      { domain: ["land_type", "Agricultural"] },
      { domain: ["land_type", "Agricultural"] },
    ],
    status: "match",
  },
  {
    id: "boundary",
    label: "pages.dataReconciliation.comparison.attributes.boundaryCoordinates",
    last: true,
    cells: [
      { valueKey: "referText", muted: true },
      { valueKey: "validGeometry" },
      { valueKey: "notAvailable", muted: true },
      { valueKey: "validGeometry" },
    ],
    status: "verified",
  },
];

const STATUS_STYLE = {
  match: {
    icon: "check_circle",
    className:
      "inline-flex items-center gap-1.5 bg-secondary-container/50 text-on-secondary-container px-2.5 py-1 rounded-full font-label-md",
  },
  mismatch: {
    icon: "error",
    className:
      "inline-flex items-center gap-1.5 bg-error/10 text-error px-2.5 py-1 rounded-full font-label-md shadow-sm ring-1 ring-error/20",
  },
  verified: {
    icon: "info",
    className:
      "inline-flex items-center gap-1.5 bg-secondary-container/50 text-on-secondary-container px-2.5 py-1 rounded-full font-label-md",
  },
};

const PARCEL = {
  ulpin: "P-1024",
  lastSynced: "2023-10-12T14:32:00+05:30",
  villageCode: "V-90821",
  rorArea: 2,
  gisArea: 2.18,
  historicalArea: 2.17,
  deltaPercent: 9,
  confidencePercent: 94,
};

const TWO_DECIMALS = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
const MISMATCH_COUNT = ATTRIBUTES.filter((row) => row.status === "mismatch").length;

export default function DataReconciliation() {
  const { t, label, formatDateTime, formatNumber } = useI18n();

  const p = (key, vars) => t(`pages.dataReconciliation.${key}`, vars);
  const hectares = (value) =>
    `${formatNumber(value, TWO_DECIMALS)} ${t("common.units.hectare")}`;
  const percent = (value) => `${formatNumber(value)}${t("common.units.percent")}`;

  const cellText = (cell) => {
    if (cell.hectares !== undefined) return hectares(cell.hectares);
    if (cell.domain) return label(cell.domain[0], cell.domain[1]);
    if (cell.valueKey) return p(`comparison.values.${cell.valueKey}`);
    return cell.text;
  };
  const cellClass = (cell) => {
    const classes = ["py-4 px-6"];
    if (cell.muted) classes.push("text-on-surface-variant italic");
    if (cell.className) classes.push(cell.className);
    return classes.join(" ");
  };

  return (
    <main className="relative pt-16 min-h-screen bg-background"><div className="px-8 py-4 flex items-center gap-2 text-label-md text-on-surface-variant"><a className="hover:text-primary" href="#">{p("breadcrumb.system")}</a><span className="material-symbols-outlined text-[14px]">chevron_right</span><span className="text-on-surface font-semibold">{p("breadcrumb.current")}</span></div><div className="flex flex-col w-full h-full text-on-surface">
    <div className="grid grid-cols-12 gap-gutter px-8 py-4 w-full flex-1">

    <div className="col-span-12 xl:col-span-8 flex flex-col gap-6">

    <div className="flex flex-col gap-2 relative bg-surface-container rounded-xl p-8 shadow-sm overflow-hidden">
    <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl mix-blend-multiply pointer-events-none"></div>
    <div className="absolute right-32 bottom-0 w-48 h-48 bg-secondary-fixed/20 rounded-full blur-2xl mix-blend-multiply pointer-events-none"></div>
    <div className="flex items-center gap-3 z-10">
    <span className="material-symbols-outlined text-primary bg-primary-fixed p-2 rounded-lg shadow-sm">rebase_edit</span>
    <h1 className="font-headline-lg text-on-surface m-0 tracking-tight">{p("title")}</h1>
    </div>
    <p className="font-body-lg text-on-surface-variant z-10">
    <InterpolatedText
      template={p("intro")}
      values={{
        ulpin: {
          text: p("ulpinChip", { id: PARCEL.ulpin }),
          className:
            "font-tabular-nums font-bold text-on-surface bg-surface px-2 py-0.5 rounded shadow-sm",
        },
      }}
    />
    </p>
    <div className="flex gap-4 mt-4 z-10">
    <button className="bg-primary text-on-primary hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg font-label-md flex items-center gap-2 shadow-md">
    <span className="material-symbols-outlined text-[18px]">architecture</span>
                    {p("actions.requestSurvey")}
                </button>
    <button className="bg-surface text-on-surface hover:bg-surface-container-highest transition-colors px-4 py-2 rounded-lg font-label-md flex items-center gap-2 shadow-sm border border-outline-variant/30">
    <span className="material-symbols-outlined text-[18px]">gavel</span>
                    {p("actions.createCase")}
                </button>
    <button className="bg-surface text-on-surface hover:bg-surface-container-highest transition-colors px-4 py-2 rounded-lg font-label-md flex items-center gap-2 shadow-sm border border-outline-variant/30">
    <span className="material-symbols-outlined text-[18px]">description</span>
                    {p("actions.viewEvidence")}
                </button>
    </div>
    </div>
    <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col">
    <div className="px-6 py-4 bg-surface-container flex items-center justify-between border-b border-outline-variant/20">
    <h2 className="font-headline-md text-on-surface m-0 flex items-center gap-2">
    <span className="material-symbols-outlined text-[20px] text-primary">table_chart</span>
                {p("comparison.heading")}
              </h2>
    <div className="flex items-center gap-2 font-label-md text-on-surface-variant bg-surface px-3 py-1.5 rounded-full shadow-sm">
    <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                 {p("comparison.mismatchCount", { count: MISMATCH_COUNT })}
              </div>
    </div>
    <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse min-w-[800px]">
    <thead>
    <tr className="bg-surface-container-low font-label-md text-on-surface-variant border-b border-outline-variant/30 uppercase tracking-wider">
    <th className="py-3 px-6 whitespace-nowrap sticky left-0 bg-surface-container-low z-10 shadow-[2px_0_4px_rgba(0,0,0,0.02)]">{p("comparison.columns.attribute")}</th>
    <th className="py-3 px-6 whitespace-nowrap">{p("comparison.columns.landRecord")}</th>
    <th className="py-3 px-6 whitespace-nowrap">{p("comparison.columns.gis")}</th>
    <th className="py-3 px-6 whitespace-nowrap">{p("comparison.columns.registration")}</th>
    <th className="py-3 px-6 whitespace-nowrap">{p("comparison.columns.survey")}</th>
    <th className="py-3 px-6 whitespace-nowrap text-right">{t("common.fields.status")}</th>
    </tr>
    </thead>
    <tbody className="font-tabular-nums text-body-md text-on-surface">
    {ATTRIBUTES.map((row) => (
    <tr key={row.id} className={row.flagged
      ? "border-b border-error/20 bg-error-container/10 hover:bg-error-container/20 transition-colors group relative"
      : `${row.last ? "" : "border-b border-outline-variant/10 "}hover:bg-surface-container-lowest/50 transition-colors group`}>
    <td className={row.flagged
      ? "py-4 px-6 sticky left-0 bg-error-container/10 group-hover:bg-error-container/20 z-10 font-label-md text-on-error-container shadow-[2px_0_4px_rgba(0,0,0,0.02)] flex items-center gap-2"
      : "py-4 px-6 sticky left-0 bg-surface-container-lowest group-hover:bg-surface-container-lowest/50 z-10 font-label-md text-on-surface shadow-[2px_0_4px_rgba(0,0,0,0.02)]"}>
    {row.flagged && <span className="material-symbols-outlined text-[16px] text-error">warning</span>}
                        {t(row.label)}
                    </td>
    {row.cells.map((cell, index) => (
    <td key={index} className={cellClass(cell)}>{cellText(cell)}</td>
    ))}
    <td className="py-4 px-6 text-right">
    <span className={STATUS_STYLE[row.status].className}>
    <span className="material-symbols-outlined text-[14px]">{STATUS_STYLE[row.status].icon}</span> {p(`comparison.status.${row.status}`)}
                      </span>
    </td>
    </tr>
    ))}
    </tbody></table>
    </div>
    </div>
    <div className="h-64 rounded-xl shadow-md overflow-hidden relative group">
    <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" role="img" aria-label={p("map.caption")} style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600')" }}></div>

    <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-md rounded-lg shadow-lg p-1.5 flex flex-col gap-1 border border-outline-variant/30">
    <button className="w-8 h-8 flex items-center justify-center rounded bg-surface text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm" aria-label={p("map.zoomIn")}><span className="material-symbols-outlined text-[18px]">add</span></button>
    <button className="w-8 h-8 flex items-center justify-center rounded bg-surface text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm" aria-label={p("map.zoomOut")}><span className="material-symbols-outlined text-[18px]">remove</span></button>
    <div className="h-[1px] w-full bg-outline-variant/30 my-1"></div>
    <button className="w-8 h-8 flex items-center justify-center rounded bg-surface text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm" aria-label={p("map.layers")}><span className="material-symbols-outlined text-[18px]">layers</span></button>
    </div>
    <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-md rounded-lg shadow-lg px-3 py-2 flex items-center gap-3 border border-outline-variant/30">
    <div className="flex items-center gap-1.5 text-label-md"><span className="w-3 h-[2px] bg-cyan-500"></span> {p("map.gisBoundary")}</div>
    <div className="flex items-center gap-1.5 text-label-md"><span className="w-3 h-[2px] bg-error"></span> {p("map.rorBoundary")}</div>
    </div>
    </div>
    </div>
    <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">

    <div className="bg-surface-container-highest rounded-xl shadow-md p-6 flex flex-col relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
    <div className="flex items-center gap-2 mb-4">
    <span className="material-symbols-outlined text-primary animate-pulse">smart_toy</span>
    <h3 className="font-headline-md text-on-surface m-0">{p("ai.heading")}</h3>
    </div>
    <div className="bg-surface rounded-lg p-4 shadow-sm border border-outline-variant/20 mb-4 relative z-10">
    <p className="font-body-md text-on-surface leading-relaxed m-0">
    <InterpolatedText
      template={p("ai.finding")}
      values={{
        gis: { text: hectares(PARCEL.gisArea), className: "font-bold text-error" },
        ror: { text: hectares(PARCEL.rorArea), className: "font-bold" },
        delta: {
          text: percent(PARCEL.deltaPercent),
          className: "font-tabular-nums text-error",
        },
      }}
    />
              </p>
    </div>
    <div className="space-y-4 relative z-10">
    <div className="flex gap-3">
    <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">history</span>
    <div>
    <h4 className="font-label-md text-on-surface mb-1 uppercase tracking-wider">{p("ai.historicalHeading")}</h4>
    <p className="font-body-sm text-on-surface-variant m-0">{p("ai.historical", { area: hectares(PARCEL.historicalArea) })}</p>
    </div>
    </div>
    <div className="flex gap-3">
    <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">policy</span>
    <div>
    <h4 className="font-label-md text-on-surface mb-1 uppercase tracking-wider">{p("ai.ruleHeading")}</h4>
    <p className="font-body-sm text-on-surface-variant m-0">{p("ai.rule")}</p>
    </div>
    </div>
    </div>
    <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-col gap-2 z-10">
    <span className="font-label-md text-on-surface-variant uppercase tracking-widest text-[10px]">{p("ai.confidence")}</span>
    <div className="w-full bg-surface-container-low rounded-full h-2 overflow-hidden shadow-inner" role="progressbar" aria-valuenow={PARCEL.confidencePercent} aria-valuemin={0} aria-valuemax={100} aria-label={p("ai.confidence")}>
    <div className="bg-primary h-full rounded-full" style={{ width: `${PARCEL.confidencePercent}%`, transition: 'width 1s ease-in-out' }}></div>
    </div>
    <div className="flex justify-between font-tabular-nums text-label-md text-on-surface-variant">
    <span>{percent(0)}</span>
    <span className="text-primary font-bold">{percent(PARCEL.confidencePercent)}</span>
    </div>
    </div>
    </div>
    <div className="bg-surface rounded-xl shadow-sm p-6 border border-outline-variant/20">
    <h3 className="font-headline-md text-on-surface mb-4 flex items-center gap-2">
    <span className="material-symbols-outlined text-[20px] text-on-surface-variant">info</span>
                {p("metadata.heading")}
             </h3>
    <dl className="grid grid-cols-1 gap-y-3 font-body-sm">
    <div className="flex justify-between py-1 border-b border-outline-variant/10">
    <dt className="text-on-surface-variant">{t("common.fields.lastUpdated")}</dt>
    <dd className="font-tabular-nums text-on-surface font-medium">{formatDateTime(PARCEL.lastSynced)}</dd>
    </div>
    <div className="flex justify-between py-1 border-b border-outline-variant/10">
    <dt className="text-on-surface-variant">{p("metadata.subDistrict")}</dt>
    <dd className="text-on-surface font-medium">{p("metadata.subDistrictValue")}</dd>
    </div>
    <div className="flex justify-between py-1 border-b border-outline-variant/10">
    <dt className="text-on-surface-variant">{p("metadata.villageCode")}</dt>
    <dd className="font-tabular-nums text-on-surface font-medium">{PARCEL.villageCode}</dd>
    </div>
    <div className="flex justify-between py-1 border-b border-outline-variant/10">
    <dt className="text-on-surface-variant">{p("metadata.dataSource")}</dt>
    <dd className="text-on-surface font-medium flex items-center gap-1">
    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                        {p("metadata.dataSourceValue")}
                    </dd>
    </div>
    </dl>
    </div>
    </div>
    </div>
    </div></main>
  );
}
