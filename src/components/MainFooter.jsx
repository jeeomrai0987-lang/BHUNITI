export default function MainFooter() {
  return (
    <footer className="w-full bg-surface-white border-t border-border-subtle py-16">
      <div className="max-w-[1440px] mx-auto px-margin-desktop">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                alt="BHUNITI logo"
                className="h-8 w-auto"
                src="https://lh3.googleusercontent.com/aida/AEtjO1XSnvCAUNfbYhxXOfX_HEbcR5MI9eHRI79zFrcVZmV2MbcDPygj29eJK0Pg7ivJO_HaX1FnAl4hO_JwgPAYDRkQyA8plpJOLsV9ytivNKhdNl8btOvSBPP5dJjgO0b7KnE8wBLrrOP7Med-IdiuZt5-uBy72pcUNjifKhesqPjRS7QFSfmYJFltgTeGywZsRsLRaYHveY5S63LZM4a6pLzt6b38f0jujjV08bEBQefbqXlUvAM6zvyxag"
              />
              <span className="font-headline-md text-headline-md text-primary">
                BHUNITI
              </span>
            </div>
            <p className="font-body-sm text-on-surface-variant mb-6">
              Connecting Land, Data &amp; Governance. Empowering national
              infrastructure through precision GIS and legal transparency.
            </p>
            <div className="px-3 py-1 bg-surface-container-highest inline-block rounded-full">
              <span className="font-label-caps text-[10px] text-on-surface">
                Prototype for Smart India Hackathon 2026
              </span>
            </div>
          </div>
          <div>
            <h4 className="font-label-caps text-primary mb-6">Solution</h4>
            <ul className="space-y-4">
              <li className="font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Platform
              </li>
              <li className="font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Features
              </li>
              <li className="font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                How It Works
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-caps text-primary mb-6">Institution</h4>
            <ul className="space-y-4">
              <li className="font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Governance
              </li>
              <li className="font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                About
              </li>
              <li className="font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Contact
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-label-caps text-primary mb-6">Trust</h4>
            <ul className="space-y-4">
              <li className="font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Security
              </li>
              <li className="font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Privacy
              </li>
              <li className="font-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                Terms
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-body-sm text-on-surface-variant">
            © 2026 BHUNITI Infrastructure Initiative. Government of India
            Project.
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
