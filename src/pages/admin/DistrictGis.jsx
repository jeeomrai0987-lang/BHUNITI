export default function DistrictGis() {
  return (
    <main className="pt-16 min-h-screen bg-surface"><div className="flex flex-col w-full h-[calc(100vh-4rem)] bg-surface relative overflow-hidden">
    <div className="absolute inset-0 z-0 bg-surface-container" data-location="Ghaziabad District, Uttar Pradesh, India" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuCvVcBr4oCxt26DuvvELcMQePrsSnd-ZpsGzi8xLFQUniq6ruVeXnoX_zAdMK4TYqEwZVXIC1jbmJBSAIVaiwY7lmzXsLwaUOhcMFU3405hIB4PZ6hL-k9l_GBrv9BuiaPxNdc-gG9odhKTwHD3QkpLyoefJFck_uD0QRTnEEL3sRfuZ_SadQbna4ZXo9YN7AE_BlKMw0Iex385kM6sELkV5avY1RrgKOerSpqFqS8mOTEXTHCxS9k\')'}}></div>
    <div className="absolute top-6 left-6 z-10 w-[360px] flex flex-col gap-4">
    <div className="bg-surface/95 backdrop-blur-md shadow-xl rounded-xl p-5 flex flex-col gap-5">
    <div className="flex items-center justify-between">
    <h2 className="text-headline-md font-headline-md text-on-surface">Layer Controls</h2>
    <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">tune</span>
    </div>
    <div className="flex flex-col gap-3">
    <label className="flex items-center justify-between cursor-pointer group">
    <div className="flex items-center gap-3">
    <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">local_fire_department</span>
    <span className="text-body-md font-body-md text-on-surface font-medium">Discrepancy Heatmap</span>
    </div>
    <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary transition-colors">
    <span className="inline-block h-4 w-4 translate-x-4 rounded-full bg-on-primary transition-transform"></span>
    </div>
    </label>
    <label className="flex items-center justify-between cursor-pointer group">
    <div className="flex items-center gap-3">
    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">change_history</span>
    <span className="text-body-md font-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">Mutation Intensity</span>
    </div>
    <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-surface-container-highest transition-colors">
    <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-on-surface-variant transition-transform"></span>
    </div>
    </label>
    <label className="flex items-center justify-between cursor-pointer group">
    <div className="flex items-center gap-3">
    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">my_location</span>
    <span className="text-body-md font-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">Survey Clusters</span>
    </div>
    <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-surface-container-highest transition-colors">
    <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-on-surface-variant transition-transform"></span>
    </div>
    </label>
    <label className="flex items-center justify-between cursor-pointer group">
    <div className="flex items-center gap-3">
    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">layers</span>
    <span className="text-body-md font-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">Land Use Overlay</span>
    </div>
    <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-surface-container-highest transition-colors">
    <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-on-surface-variant transition-transform"></span>
    </div>
    </label>
    </div>
    </div>
    <div className="bg-surface/95 backdrop-blur-md shadow-xl rounded-xl p-5 flex flex-col gap-4">
    <h3 className="text-label-md font-label-md uppercase tracking-wider text-on-surface-variant">Active Filters</h3>
    <div className="flex flex-col gap-3">
    <div className="relative">
    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">account_balance</span>
    <select className="w-full bg-surface-container-low text-body-md font-body-md text-on-surface pl-10 pr-4 py-2.5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary transition-shadow">
    <option>All Tehsils</option>
    <option selected="">Ghaziabad</option>
    <option>Loni</option>
    <option>Modinagar</option>
    </select>
    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">arrow_drop_down</span>
    </div>
    <div className="relative">
    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">holiday_village</span>
    <select className="w-full bg-surface-container-low text-body-md font-body-md text-on-surface pl-10 pr-4 py-2.5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary transition-shadow">
    <option selected="">All Villages</option>
    <option>Dasna</option>
    <option>Muradnagar</option>
    <option>Loni Dehat</option>
    </select>
    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">arrow_drop_down</span>
    </div>
    </div>
    </div>
    </div>
    <div className="absolute bottom-6 left-6 z-10 w-[360px]">
    <div className="bg-surface/95 backdrop-blur-md shadow-xl rounded-xl p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between mb-1">
    <h3 className="text-label-md font-label-md uppercase tracking-wider text-on-surface-variant">Hotspot Density (Criticality)</h3>
    <span className="material-symbols-outlined text-[16px] text-on-surface-variant cursor-help" title="Density of discrepancies per sq km">info</span>
    </div>
    <div className="h-2 w-full rounded-full bg-gradient-to-r from-surface-container-highest via-tertiary-fixed to-error overflow-hidden"></div>
    <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant mt-1">
    <span>Low (&lt;10/km²)</span>
    <span>Amber (10-50/km²)</span>
    <span className="text-error font-medium">Critical (&gt;50/km²)</span>
    </div>
    </div>
    </div>
    <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
    <div className="bg-surface/95 backdrop-blur-md shadow-lg rounded-xl flex flex-col overflow-hidden">
    <button className="p-3 hover:bg-surface-container transition-colors text-on-surface flex items-center justify-center group">
    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add</span>
    </button>
    <div className="h-[1px] w-full bg-surface-container-highest"></div>
    <button className="p-3 hover:bg-surface-container transition-colors text-on-surface flex items-center justify-center group">
    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">remove</span>
    </button>
    </div>
    <div className="bg-surface/95 backdrop-blur-md shadow-lg rounded-xl mt-2 flex flex-col overflow-hidden">
    <button className="p-3 hover:bg-surface-container transition-colors text-on-surface flex items-center justify-center group" title="Reset View">
    <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">my_location</span>
    </button>
    <div className="h-[1px] w-full bg-surface-container-highest"></div>
    <button className="p-3 hover:bg-surface-container transition-colors text-on-surface flex items-center justify-center group" title="Full Screen">
    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">fullscreen</span>
    </button>
    </div>
    </div>
    <div className="absolute top-1/2 left-[45%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none group">
    <div className="w-16 h-16 bg-error/20 rounded-full animate-ping absolute -left-4 -top-4"></div>
    <div className="w-8 h-8 bg-error rounded-full flex items-center justify-center shadow-lg relative cursor-pointer pointer-events-auto hover:scale-110 transition-transform">
    <span className="material-symbols-outlined text-on-error text-[20px]" style={{fontVariationSettings: '\'FILL\' 1'}}>warning</span>
    </div>
    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-surface shadow-xl rounded-xl p-4 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
    <div className="flex flex-col gap-2">
    <div className="flex items-start justify-between">
    <span className="text-label-md font-label-md text-error bg-error-container px-2 py-0.5 rounded">CRITICAL HOTSPOT</span>
    <span className="text-body-sm font-body-sm text-on-surface-variant font-tabular-nums">Loni Tehsil</span>
    </div>
    <h4 className="text-body-lg font-body-lg font-semibold text-on-surface mt-1">Area 4B Overlap</h4>
    <p className="text-body-sm font-body-sm text-on-surface-variant line-clamp-2">High concentration of spatial boundary mismatches detected in recent survey vs legacy records.</p>
    <button className="text-body-sm font-body-sm text-primary font-semibold hover:underline text-left mt-2 flex items-center">
              View 142 Cases <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
    </button>
    </div>
    </div>
    </div>
    </div>
    </main>
  );
}
