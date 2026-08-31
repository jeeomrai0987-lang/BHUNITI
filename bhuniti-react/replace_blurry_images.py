import os
import re

# Comprehensive mapping of replacements for crystal clear high-res imagery
REPLACEMENTS = {
    # Logos
    r'src="https://lh3\.googleusercontent\.com/aida[^"]*"': 'src="/src/assets/logo.jpeg"',
    r'src="https://lh3\.googleusercontent\.com/aida-public/AB6AXuBRAMpV8JrL6BS9[^"]*"': 'src="/src/assets/logo.jpeg"',
    r'src="https://lh3\.googleusercontent\.com/aida-public/AB6AXuB_KfiqkQN4LB4a[^"]*"': 'src="/src/assets/logo.jpeg"',
    
    # Avatars (Indian Officers & Citizens)
    r'src="https://lh3\.googleusercontent\.com/aida-public/AB6AXuCd1s1Wu1tRFYDp[^"]*"': 'src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"',
    r'src="https://lh3\.googleusercontent\.com/aida/AEtjO1U6o5SJhtUFoWr8[^"]*"': 'src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"',
    r'src="https://lh3\.googleusercontent\.com/aida-public/AB6AXuC0qMIYBuoybSCe9EEG4OkwtO70[^"]*"': 'src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"',
    r'src="https://lh3\.googleusercontent\.com/aida-public/AB6AXuDO32FTrO9riYpEKu0tgWQJ5osE[^"]*"': 'src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"',
    r'src="https://lh3\.googleusercontent\.com/aida-public/AB6AXuBYyDe9L7VIthGwv9aUlBOx5YtL[^"]*"': 'src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300"',
    
    # High-Res Backgrounds & Maps
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuC3UqUidDVyB4oiILh4TJU9FlLQ[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuBt5MHNm06FwmnPAMu6B7h3xX7v[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuDxHIw3mekBP3pnQYDa8n0ffFRw[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuBfeKkFgLRn7xd3FLLr2mgqxwPu[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuBJHpUU5pIVhOqduWGps2TqQVuk[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuCWwKYku1tsvmJj3e_9n_MwUW10[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuDERYAeGpzaClqmm1XHHFZdIi1D[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuCByIT1G09mPNbNWEfQCA9xEXvj[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuBm1RselE71Yybl0OZu61aNSvJu[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuAtDAxCMgJ_2YrQqhDcf-eFmJ-d[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuCUj8StR57KkGAr10iWLPQZbKBP[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuDQNSbheWT1frQGRTVfdRXozZPK[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuAFrjq0XpoWkBywIhWrNRf8AQAE[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuD2J9bMrDgjAnbsSVtwbRPmDt-W[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuDd7ECT5C7iPGx_hbW4Kr9YLUDi[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuDsOhYV_T2NerqCsLT25TBJK9Xc[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuASPfcoYxvbjDXaUGwSrjj0hyp-[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuDQb3nnsAVLVfiKNYhYTXJgHGLs[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600\')',
    r'url\([\'"]https://lh3\.googleusercontent\.com/aida-public/AB6AXuAOLp7W7Sx1eVW8pMRZKsHdS3jR[^"]*[\'"]\)': 'url(\'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600\')',
}

SRC_DIR = r"d:\sih\BHUNITI\bhuniti-react\src"

def replace_blurry_images():
    count = 0
    for root, dirs, files in os.walk(SRC_DIR):
        for f in files:
            if f.endswith(".jsx") or f.endswith(".js"):
                filepath = os.path.join(root, f)
                with open(filepath, "r", encoding="utf-8") as file:
                    content = file.read()
                
                new_content = content
                # Apply all regex replacements
                for pattern, replacement in REPLACEMENTS.items():
                    new_content = re.sub(pattern, replacement, new_content)
                
                # Catch any remaining lh3.googleusercontent.com
                if "lh3.googleusercontent.com" in new_content:
                    new_content = re.sub(
                        r'https://lh3\.googleusercontent\.com/[^\'"\s)]+',
                        'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200',
                        new_content
                    )

                if new_content != content:
                    with open(filepath, "w", encoding="utf-8") as file:
                        file.write(new_content)
                    print(f"Updated: {f}")
                    count += 1

    print(f"\nSuccessfully updated {count} files with crystal clear high-resolution responsive images!")

if __name__ == "__main__":
    replace_blurry_images()
