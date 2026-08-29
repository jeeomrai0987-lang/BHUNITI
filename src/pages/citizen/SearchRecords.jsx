export default function SearchRecords() {
  return (
    <main className="w-full pt-16 bg-surface min-h-screen"><div className="flex flex-col w-full max-w-7xl mx-auto px-margin-mobile lg:px-margin-desktop py-8 gap-8">

    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container p-6 rounded-2xl shadow-sm relative overflow-hidden">
    <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
    <div className="relative z-10">
    <p className="font-label-md text-label-md text-primary uppercase tracking-widest mb-1 flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-primary block animate-pulse"></span>
                    Verified Land Record
                </p>
    <h1 className="font-display text-display text-on-surface tracking-tight">ULPIN 09-XXXX-XXXX-1024</h1>
    </div>
    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">

    <div className="flex items-center gap-3 bg-surface-container-lowest p-2 pr-4 rounded-full shadow-sm">
    <img className="w-8 h-8 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYyDe9L7VIthGwv9aUlBOx5YtLdXhsMD-6PlT1SYuA_2eKAkmL3mSEnh9s0N7bbyTnaNQWdSCzUMGROZ-EanSeGLiskqXS9snog3P-9OHq5Q_M5krv2PTV64CQnpbMNkERXeg0XdnF9sXst3w9wMJLT3pt1X4GU5potd_zk4tQsnGMAEHxR0QEiyW7GutfA8bHvYmSlrPtvwpb60MTc6bMmqGwu_F2LSanBuFaYpAkNnPo4LWrq_4" />
    <div className="flex flex-col">
    <span className="font-label-md text-[10px] leading-tight text-on-surface-variant uppercase">Accessed By</span>
    <span className="font-label-md text-label-md text-on-surface">Citizen Session</span>
    </div>
    </div>
    <div className="flex items-center gap-2 bg-primary-container px-4 py-2.5 rounded-xl shadow-sm">
    <span className="material-symbols-outlined text-on-primary-container text-[20px]">verified</span>
    <span className="font-label-md text-label-md text-on-primary-container uppercase">Legally Synced</span>
    </div>
    </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">

    <div className="lg:col-span-8 flex flex-col gap-6">

    <div className="relative w-full h-[500px] rounded-2xl shadow-md overflow-hidden bg-surface-container group">
    <div className="absolute inset-0 w-full h-full bg-cover bg-center" data-location="Agricultural Land, Maharashtra, India" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuAc62GgBhnA_gl-VEaDsXI5Hm8OzC-3Cixsx4ZTpqshVidHLud2VsQoUHnvMzrYugqpX67cyUhap74Jv0PW4T45aUG-Q6lIJZFWTQrV8M3HKGLfh3tq1-p6GVh8MTl9lY92ByC3518_Uo9fzRocJ9Kmq-tgFa_qVVPK5NAnL7DMa0eSGyzWhPuGPnBIMG1Zv7AKp3oJp21Dxo_7Fv7dmKR-F8RJiAMNYLStksTAbgpruTWb7d_qQbg\')'}}></div>

    <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-md p-2 rounded-xl shadow-lg flex flex-col gap-2">
    <button className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary rounded-lg shadow-sm hover:scale-105 transition-transform"><span className="material-symbols-outlined text-[20px]">add</span></button>
    <button className="w-8 h-8 flex items-center justify-center bg-surface-container-lowest text-on-surface rounded-lg shadow-sm hover:scale-105 transition-transform"><span className="material-symbols-outlined text-[20px]">remove</span></button>
    <div className="w-8 h-0.5 bg-outline-variant/30 my-1"></div>
    <button className="w-8 h-8 flex items-center justify-center bg-surface-container-lowest text-on-surface rounded-lg shadow-sm hover:scale-105 transition-transform"><span className="material-symbols-outlined text-[20px]">layers</span></button>
    </div>

    <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md" preserveAspectRatio="none" viewBox="0 0 100 100">
    <polygon fill="rgba(34, 197, 94, 0.25)" points="25,25 75,30 85,80 35,90 20,60" stroke="#22c55e" strokeDasharray="2 1" strokeWidth="0.75"></polygon>
    <circle cx="25" cy="25" fill="#22c55e" r="1.5"></circle>
    <circle cx="75" cy="30" fill="#22c55e" r="1.5"></circle>
    <circle cx="85" cy="80" fill="#22c55e" r="1.5"></circle>
    <circle cx="35" cy="90" fill="#22c55e" r="1.5"></circle>
    <circle cx="20" cy="60" fill="#22c55e" r="1.5"></circle>
    </svg>
    <div className="absolute bottom-4 left-4 bg-surface-container-lowest/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm flex items-center gap-3">
    <span className="w-3 h-3 rounded-sm bg-green-500 shadow-sm block"></span>
    <span className="font-label-md text-label-md text-on-surface">Verified Boundary</span>
    </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="bg-surface-container-low p-5 rounded-2xl shadow-sm flex items-center gap-4 group cursor-pointer hover:shadow-md hover:bg-surface transition-all">
    <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
    <span className="material-symbols-outlined text-[28px]">description</span>
    </div>
    <div className="flex-1 min-w-0">
    <h3 className="font-headline-md text-[18px] font-semibold text-on-surface truncate mb-0.5">Record of Rights (RoR)</h3>
    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Form 7/12 • Updated 2 days ago</p>
    </div>
    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
    </div>
    <div className="bg-surface-container-low p-5 rounded-2xl shadow-sm flex items-center gap-4 group cursor-pointer hover:shadow-md hover:bg-surface transition-all">
    <div className="w-14 h-14 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container shrink-0">
    <span className="material-symbols-outlined text-[28px]">map</span>
    </div>
    <div className="flex-1 min-w-0">
    <h3 className="font-headline-md text-[18px] font-semibold text-on-surface truncate mb-0.5">Cadastral Map</h3>
    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">Geo-referenced • High Res PDF</p>
    </div>
    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
    </div>
    </div>
    </div>

    <div className="lg:col-span-4 flex flex-col gap-6">

    <div className="bg-surface-container-lowest shadow-md rounded-2xl overflow-hidden flex flex-col">
    <div className="p-6 bg-surface-container flex items-center gap-3">
    <span className="material-symbols-outlined text-primary">data_info_alert</span>
    <h2 className="font-headline-md text-headline-md text-on-surface">Verified Details</h2>
    </div>
    <div className="flex flex-col">

    <div className="flex items-center justify-between p-5 bg-surface-container-lowest">
    <span className="font-body-md text-body-md text-on-surface-variant">Owner</span>
    <span className="font-headline-md text-[18px] font-semibold text-on-surface">Rahul Sharma</span>
    </div>

    <div className="flex items-center justify-between p-5 bg-surface-container-low">
    <span className="font-body-md text-body-md text-on-surface-variant">Area</span>
    <span className="font-tabular-nums text-[16px] font-semibold text-on-surface">2.00 ha</span>
    </div>

    <div className="flex items-center justify-between p-5 bg-surface-container-lowest">
    <span className="font-body-md text-body-md text-on-surface-variant">Land Use</span>
    <span className="font-label-md text-label-md text-on-tertiary-fixed bg-tertiary-fixed px-3 py-1 rounded-full shadow-sm">Agricultural</span>
    </div>

    <div className="flex items-center justify-between p-5 bg-surface-container-low">
    <span className="font-body-md text-body-md text-on-surface-variant">Encumbrance</span>
    <span className="font-label-md text-label-md text-on-surface-variant bg-surface-variant px-3 py-1 rounded-full shadow-sm">None</span>
    </div>
    </div>

    <div className="p-6 bg-surface-container-lowest flex flex-col gap-2">
    <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant mb-1">
    <span>Data Completeness</span>
    <span className="font-tabular-nums">100%</span>
    </div>
    <div className="w-full h-2 rounded-full bg-surface-variant overflow-hidden">
    <div className="h-full bg-primary rounded-full w-full"></div>
    </div>
    </div>
    </div>

    <div className="bg-tertiary-container p-5 rounded-2xl shadow-sm flex items-start gap-4">
    <span className="material-symbols-outlined text-on-tertiary-container shrink-0">policy</span>
    <p className="font-body-sm text-body-sm text-on-tertiary-container leading-relaxed">
    <strong>Disclaimer:</strong> This is a digital copy for informational purposes. For legal title, please download the digitally signed certificate.
                    </p>
    </div>

    <button className="w-full bg-primary text-on-primary py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 font-headline-md text-[16px] font-semibold mt-2 group">
    <span className="material-symbols-outlined group-hover:animate-bounce">download</span>
                    Download Signed Title Deed
                </button>
    </div>
    </div>
    </div></main>
  );
}
