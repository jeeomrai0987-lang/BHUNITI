export default function CitizenFooter() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant py-12">
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                className="h-6 w-auto"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRAMpV8JrL6BS9PJyR6Wk4hs-pK5uA_64T-Jkif1QSgoRwZhngmpjGloiVwCqfhWspxB11eNm-7EXB25lgicOE6pTSp-ULtfyaxTuaQ8k4sjrwhhY3rZqu0TKZq8hVzeR2M-gGaFdZd4GDPfq9XR0My3QR7t0GyVS5lnJ9-SwB2Tx6JrA1eNFqAix0HhC6ss4XW7x_9Jv-cQZhmFAkPEOJvXzEXqJWqZmndVWc-eWSBQ8UQ7Cf3P4"
              />
              <span className="font-headline-md text-primary">BHUNEXIS</span>
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
