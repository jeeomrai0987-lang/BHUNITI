import os
import re

SRC_DIR = r"d:\sih\BHUNITI\bhuniti-react\src"

def fix_bg_styles():
    count = 0
    for root, dirs, files in os.walk(SRC_DIR):
        for f in files:
            if f.endswith(".jsx") or f.endswith(".js"):
                filepath = os.path.join(root, f)
                with open(filepath, "r", encoding="utf-8") as file:
                    content = file.read()

                # Replace messy url(\'...\') or url('...') with clean `url("...")` in style objects
                # E.g.: style={{backgroundImage: 'url(\'...\')'}} or style={{backgroundImage: 'url(\'...\')'}}
                def clean_bg(match):
                    url = match.group(1).replace("\\'", "").replace("'", "").replace('"', '').strip()
                    return f'style={{{{ backgroundImage: `url("${url}")` }}}}'

                # Pattern matching style={{backgroundImage: ...}}
                new_content = re.sub(
                    r'style=\{\{\s*backgroundImage:\s*[\'"`]url\((.*?)\)[\'"`]\s*\}\}',
                    clean_bg,
                    content
                )
                
                # Also handle remaining malformed ones
                new_content = re.sub(
                    r"style=\{\{backgroundImage:\s*'url\(\\'.*?\\'\)'\}\}",
                    lambda m: f'style={{{{ backgroundImage: `url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600")` }}}}',
                    new_content
                )

                if new_content != content:
                    with open(filepath, "w", encoding="utf-8") as file:
                        file.write(new_content)
                    print(f"Fixed quotes in: {f}")
                    count += 1

    print(f"Cleaned syntax in {count} files.")

if __name__ == "__main__":
    fix_bg_styles()
