import os
import re

SRC_DIR = r"d:\sih\BHUNITI\bhuniti-react\src"

def fix_all_images():
    print("Fixing all background images and broken styles...")
    
    # Specific per-file fixes for rich, perfectly working background images
    file_fixes = {
        "Home.jsx": [
            (
                r'<div className="absolute inset-0 z-0"[^>]*style=\{\{[^}]*\}\}[^>]*></div>',
                '<div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000\')", filter: "contrast(1.15) saturate(1.25) brightness(0.85)" }}></div>'
            ),
            (
                r'<div className="absolute inset-0 backdrop-blur-\[2px\] z-0 bg-primary/20"[^>]*style=\{\{[^}]*\}\}[^>]*></div>',
                '<div className="absolute inset-0 backdrop-blur-[2px] z-0 bg-primary/20 bg-cover bg-center" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000\')", filter: "contrast(1.15) saturate(1.25) brightness(0.85)" }}></div>'
            ),
            (
                r'<div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay"[^>]*style=\{\{[^}]*\}\}[^>]*></div>',
                '<div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay bg-cover bg-center" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000\')" }}></div>'
            )
        ],
        "About.jsx": [
            (
                r'<div className="w-full h-full bg-cover bg-center absolute inset-0 z-0"[^>]*style=\{\{[^}]*\}\}[^>]*></div>',
                '<div className="w-full h-full bg-cover bg-center absolute inset-0 z-0 shadow-inner" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000\')" }}></div>'
            )
        ],
        "Login.jsx": [
            (
                r'backgroundImage:\s*"url\([\'"][^)]*[\'"]\)"',
                'backgroundImage: "url(\'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000\')"'
            )
        ],
        "Features.jsx": [
            (
                r'<div className="h-72 w-full relative bg-surface-container"[^>]*data-location="New Delhi, India"[^>]*style=\{\{[^}]*\}\}>',
                '<div className="h-72 w-full relative bg-cover bg-center rounded-2xl overflow-hidden shadow-md" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200\')" }}>'
            ),
            (
                r'<div className="h-72 w-full relative bg-cover bg-center"[^>]*data-alt="Close up of a modern tablet[^>]*style=\{\{[^}]*\}\}>',
                '<div className="h-72 w-full relative bg-cover bg-center rounded-2xl overflow-hidden shadow-md" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200\')" }}>'
            ),
            (
                r'<div className="h-72 w-full relative bg-surface-container"[^>]*data-location="Mumbai, India"[^>]*style=\{\{[^}]*\}\}>',
                '<div className="h-72 w-full relative bg-cover bg-center rounded-2xl overflow-hidden shadow-md" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200\')" }}>'
            )
        ],
        "Governance.jsx": [
            (
                r'<div className="bg-cover bg-center w-full h-full"[^>]*data-alt="A modern, high-tech government data center[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="bg-cover bg-center w-full h-full" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            )
        ],
        "HowItWorks.jsx": [
            (
                r'<div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"[^>]*data-location="Connaught Place, New Delhi"[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            )
        ],
        "Platform.jsx": [
            (
                r'<div className="absolute inset-0 z-0 pointer-events-none opacity-5"[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="absolute inset-0 z-0 pointer-events-none opacity-10 bg-cover bg-center" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            ),
            (
                r'<div className="absolute right-0 top-0 w-1/2 h-full opacity-20 group-hover:opacity-40 transition-opacity"[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="absolute right-0 top-0 w-1/2 h-full opacity-30 group-hover:opacity-50 transition-opacity bg-cover bg-center" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            )
        ],
        "Portal.jsx": [
            (
                r'<div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"[^>]*data-location="New Delhi, India"[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            )
        ],
        "Overview.jsx": [
            (
                r'<div className="absolute inset-0 bg-cover bg-center w-full h-full"[^>]*data-location="Ghaziabad District, Uttar Pradesh"[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="absolute inset-0 bg-cover bg-center w-full h-full" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            ),
            (
                r'<div className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-80" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            )
        ],
        "ReconciliationMonitor.jsx": [
            (
                r'<div className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            )
        ],
        "TehsilAnalytics.jsx": [
            (
                r'<div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            )
        ],
        "DataReconciliation.jsx": [
            (
                r'<div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            )
        ],
        "DiscrepancyCases.jsx": [
            (
                r'<div className="absolute inset-0 bg-cover bg-center"[^>]*data-location="Agricultural plots[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            ),
            (
                r'<div className="absolute inset-0 bg-cover bg-center"[^>]*data-alt="Scanned historical map[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            )
        ],
        "FieldSurvey.jsx": [
            (
                r'<div className="w-full h-full bg-cover bg-center"[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            )
        ],
        "HistoricalTimeline.jsx": [
            (
                r'<div className="w-full h-full bg-cover bg-center absolute inset-0"[^>]*data-location="Cadastral Map[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="w-full h-full bg-cover bg-center absolute inset-0" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            ),
            (
                r'<div className="w-full h-full bg-cover bg-center absolute inset-0 mix-blend-luminosity[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="w-full h-full bg-cover bg-center absolute inset-0 opacity-90 transition-all duration-500 rounded-xl" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            )
        ],
        "ReportsAnalytics.jsx": [
            (
                r'<div className="absolute inset-0 w-full h-full bg-cover bg-center"[^>]*style=\{\{[^}]*\}\}></div>',
                '<div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: "url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600\')" }}></div>'
            )
        ]
    }

    # General cleanup for any remaining `$https:` or broken `url("$...")`
    for root, dirs, files in os.walk(SRC_DIR):
        for f in files:
            if f.endswith(".jsx") or f.endswith(".js"):
                filepath = os.path.join(root, f)
                with open(filepath, "r", encoding="utf-8") as file:
                    content = file.read()

                new_content = content
                
                # Apply file specific fixes
                if f in file_fixes:
                    for pattern, replacement in file_fixes[f]:
                        new_content = re.sub(pattern, replacement, new_content)

                # General regex to eliminate any remaining `url("$https://...")` or `$https://`
                new_content = new_content.replace('"$https://', '"https://').replace("'$https://", "'https://").replace('`$https://', '`https://')

                if new_content != content:
                    with open(filepath, "w", encoding="utf-8") as file:
                        file.write(new_content)
                    print(f"Fixed: {f}")

    print("All background images and hero containers fixed with crisp HD photos!")

if __name__ == "__main__":
    fix_all_images()
