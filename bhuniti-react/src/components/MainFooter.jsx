import logoImg from "../assets/logo.jpeg";
import { useI18n } from "../i18n";

export default function MainFooter() {
  const { t } = useI18n();

  // Three link columns. These have never navigated anywhere in the prototype;
  // they are kept as plain text so the layout is unchanged.
  const columns = [
    { heading: "solution", items: ["platform", "features", "howItWorks"], from: "nav" },
    { heading: "institution", items: ["governance", "about"], from: "nav" },
    { heading: "trust", items: ["security", "privacy", "terms"], from: "footer" },
  ];

  return (
    <footer className="w-full bg-surface-white border-t border-border-subtle py-16">
      <div className="max-w-[1440px] mx-auto px-margin-desktop">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                alt={t("common.app.name")}
                className="h-9 w-auto rounded-lg object-contain shadow-sm"
                src={logoImg}
              />
              <span className="font-headline-md text-headline-md text-primary font-bold">
                {t("common.app.name")}
              </span>
            </div>
            <p className="font-body-sm text-on-surface-variant mb-6">
              {t("components.footer.tagline")}
            </p>
            <div className="px-3 py-1 bg-surface-container-highest inline-block rounded-full">
              <span className="font-label-caps text-[10px] text-on-surface">
                {t("components.footer.badge")}
              </span>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h4 className="font-label-caps text-primary mb-6">
                {t(`components.footer.${column.heading}`)}
              </h4>
              <ul className="space-y-4">
                {column.items.map((item) => (
                  <li
                    key={item}
                    className="font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    {t(`components.${column.from}.${item}`)}
                  </li>
                ))}
                {column.heading === "institution" && (
                  <li className="font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                    {t("components.footer.contact")}
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-body-sm text-on-surface-variant">
            {t("components.footer.copyright")}
          </span>
          <div className="flex gap-6">
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">
              public
            </span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">
              gavel
            </span>
            <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer">
              shield
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
