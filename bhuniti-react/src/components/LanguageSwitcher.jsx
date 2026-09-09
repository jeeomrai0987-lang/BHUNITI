import { useI18n } from "../i18n";

/*
 * The language toggle that sits in all four portal chromes.
 *
 * Two locales ship, so this is a segmented control rather than a dropdown --
 * one tap to switch, no menu to open. Each option is labelled with the language's
 * own name (English / हिन्दी) because someone who cannot read the current
 * language still needs to find their own.
 */

/**
 * @param {object} props
 * @param {boolean} [props.compact] icon-width buttons for the dense officer topbars
 * @param {string} [props.className] extra classes for positioning
 */
export default function LanguageSwitcher({ compact = false, className = "" }) {
  const { locale, setLocale, locales, t } = useI18n();

  const base = compact
    ? "px-2 py-1 text-[11px] leading-none"
    : "px-2.5 py-1 text-label-md";

  return (
    <div
      role="group"
      aria-label={t("common.language.change")}
      className={`inline-flex items-center gap-0.5 rounded-lg border border-outline-variant bg-surface-container-lowest p-0.5 ${className}`}
    >
      {locales.map((option) => {
        const isActive = option.code === locale;
        return (
          <button
            key={option.code}
            type="button"
            lang={option.code}
            onClick={() => setLocale(option.code)}
            aria-pressed={isActive}
            title={option.endonym}
            className={`${base} rounded-md font-label-md transition-colors ${
              isActive
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
            }`}
          >
            <span aria-hidden="true">{compact ? option.short : option.endonym}</span>
            <span className="sr-only">{option.endonym}</span>
          </button>
        );
      })}
    </div>
  );
}
