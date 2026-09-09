import logoImg from "../assets/logo.jpeg";
import { useI18n } from "../i18n";

export default function CitizenFooter() {
  const { t } = useI18n();

  const quickLinks = ["privacyPolicy", "termsOfService", "systemStatus"];

  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant py-12">
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                className="h-8 w-auto rounded-lg object-contain shadow-sm"
                src={logoImg}
                alt={t("common.app.name")}
              />
              <span className="font-headline-md text-primary font-bold">
                {t("common.app.name")}
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant max-w-sm">
              {t("components.citizenFooter.about")}
            </p>
          </div>
          <div>
            <h4 className="font-label-md text-on-surface mb-4">
              {t("components.citizenFooter.quickLinks")}
            </h4>
            <ul className="space-y-2 text-body-sm text-on-surface-variant">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a className="hover:text-primary" href="#">
                    {t(`components.citizenFooter.${link}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-on-surface mb-4">
              {t("components.footer.contact")}
            </h4>
            <ul className="space-y-2 text-body-sm text-on-surface-variant">
              <li className="font-tabular-nums">
                {t("components.citizenFooter.support", { number: "1800-180-1551" })}
              </li>
              <li>
                {t("components.citizenFooter.email", { address: "support@bhuniti.gov.in" })}
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-body-sm text-on-surface-variant">
          <span>{t("components.citizenFooter.copyright")}</span>
          <div className="flex gap-6">
            <a className="hover:text-primary" href="#">
              {t("components.citizenFooter.accessibility")}
            </a>
            <a className="hover:text-primary" href="#">
              {t("common.language.label")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
