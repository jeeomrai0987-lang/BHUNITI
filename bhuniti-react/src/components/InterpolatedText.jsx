/*
 * Renders one translated sentence whose {{placeholders}} need their own markup.
 *
 * The alternative -- splitting the sentence into two or three t() calls with
 * <span>s between them -- silently bakes English word order into every other
 * language. Here the sentence stays a single catalog entry and is split on its
 * own placeholders at render time, so Hindi is free to put the highlighted
 * value first, last or in the middle.
 *
 *   <InterpolatedText
 *     template={p("ai.finding")}               // no vars: placeholders survive
 *     values={{ area: { text: "2.18 ha", className: "font-bold text-error" } }}
 *   />
 *
 * (`p` being the page's own t() wrapper, as every page defines one.)
 * A value may also be a ready-made node, for a link or an icon.
 */
export default function InterpolatedText({ template, values = {} }) {
  if (typeof template !== "string") return null;

  return template.split(/(\{\{\s*\w+\s*\}\})/g).map((part, index) => {
    const placeholder = part.match(/^\{\{\s*(\w+)\s*\}\}$/);
    if (!placeholder) return part;

    const value = values[placeholder[1]];
    // An unknown name is left visible on purpose: a stray {{foo}} on screen is
    // a bug report, whereas a silently dropped one is a mystery.
    if (value === undefined || value === null) return part;
    if (typeof value === "string" || typeof value === "number") return value;
    if (value.text === undefined) return <span key={index}>{value}</span>;

    return (
      <span key={index} className={value.className}>
        {value.text}
      </span>
    );
  });
}
