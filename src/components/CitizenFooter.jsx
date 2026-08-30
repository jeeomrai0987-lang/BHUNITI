import logoImg from "../assets/logo.jpeg";

export default function CitizenFooter() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant py-12">
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                className="h-8 w-auto rounded-lg object-contain shadow-sm"
                src={logoImg}
                alt="BHUNITI"
              />
              <span className="font-headline-md text-primary font-bold">BHUNITI</span>
            </div>
            <p className="text-body-sm text-on-surface-variant max-w-sm">
              A secure, digital gateway for land governance and property
              administration. Empowering citizens with transparent access to
              land records and legal services.
            </p>
          </div>
          <div>
            <h4 className="font-label-md text-on-surface mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-body-sm text-on-surface-variant">
              <li>
                <a className="hover:text-primary" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  Terms of Service
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="#">
                  System Status
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-md text-on-surface mb-4">Contact</h4>
            <ul className="space-y-2 text-body-sm text-on-surface-variant">
              <li>Support: 1-800-BHU-NEXIS</li>
              <li>Email: support@bhunexis.gov</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-body-sm text-on-surface-variant">
          <span>© 2024 BHUNEXIS Land Administration. Government of BH.</span>
          <div className="flex gap-6">
            <a className="hover:text-primary" href="#">
              Accessibility
            </a>
            <a className="hover:text-primary" href="#">
              Language
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
