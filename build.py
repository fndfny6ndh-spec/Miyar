"""Build a portable HTML edition; no dependencies required."""
from pathlib import Path
import json
root = Path(__file__).resolve().parent
html = (root / 'index.html').read_text()
css = (root / 'styles.css').read_text()
core = (root / 'core.js').read_text().replace('export ', '')
app = (root / 'app.js').read_text().split('\n', 1)[1]
data = [json.loads((root / 'indicators.json').read_text()), json.loads((root / 'sources/references.json').read_text())]
script = 'window.MIYAR_DATA=' + json.dumps(data, ensure_ascii=False).replace('<', '\\u003c') + ';\n' + core + '\n' + app
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>' + css + '</style>')
html = html.replace('<script type="module" src="app.js"></script>', '<script type="module">' + script.replace('</script', '<\\/script') + '</script>')
(root / 'miyar.html').write_text(html)
print('Built miyar.html: portable HTML with embedded CSS, JavaScript and indicators.')
