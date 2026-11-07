const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// 1. Verificar si Readability/Turndown ya están
if (html.indexOf("Readability.js") !== -1) {
    console.log("⚠️ Readability ya existe");
} else {
    // Añadir CDN al <head>
    const headMarker = "</head>";
    if (html.indexOf(headMarker) === -1) {
        console.log("❌ No se encontró </head>");
        process.exit(1);
    }
    const cdnScripts = `
    <!-- Readability: extrae contenido principal (Mozilla) -->
    <script src="https://cdn.jsdelivr.net/npm/@mozilla/readability@0.5.0/Readability.js"></script>
    <!-- Turndown: HTML → Markdown -->
    <script src="https://cdn.jsdelivr.net/npm/turndown@7.2.0/dist/turndown.js"></script>
`;
    html = html.replace(headMarker, cdnScripts + headMarker);
    console.log("✅ Readability + Turndown añadidos al <head>");
}

// 2. Añadir SetunScraper antes del marker del panel
if (html.indexOf("SetunScraper") !== -1) {
    console.log("⚠️ SetunScraper ya existe");
} else {
    const marker = "console.log(\"🔍 Panel de debug activado\");";
    if (html.indexOf(marker) === -1) {
        console.log("❌ No se encontró el marker del panel");
        process.exit(1);
    }

    const scraper = `
    // ═══════════════════════════════════════════════════════════
    // SetunScraper: scraping cliente con Readability + Turndown
    // ═══════════════════════════════════════════════════════════
    (function() {
        if (window.SetunScraper) return;

        window.SetunScraper = {
            async scrape(url, options = {}) {
                try {
                    const resp = await fetch(url, {
                        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Newtral/1.0)' }
                    });
                    if (!resp.ok) return null;
                    const html = await resp.text();
                    const doc = new DOMParser().parseFromString(html, 'text/html');

                    // Readability
                    let article = null;
                    if (window.Readability) {
                        try { article = new Readability(doc).parse(); } catch(e) {}
                    }

                    // Turndown
                    let markdown = '';
                    if (window.TurndownService && article) {
                        try {
                            const turndown = new TurndownService({
                                headingStyle: 'atx',
                                codeBlockStyle: 'fenced'
                            });
                            markdown = turndown.turndown(article.content);
                        } catch(e) {}
                    }

                    return {
                        title: article?.title || doc.title,
                        textContent: article?.textContent || doc.body?.textContent || '',
                        markdown: markdown,
                        length: article?.length || 0,
                        url: url
                    };
                } catch(e) {
                    console.warn('⚠️ SetunScraper falla:', e.message);
                    return null;
                }
            }
        };

        console.log("✅ SetunScraper cargado (Readability + Turndown)");
    })();

    `;

    html = html.replace(marker, scraper + marker);
    console.log("✅ SetunScraper insertado");
}

fs.writeFileSync("index.html", html);
console.log("✅ Fix scraper completado");
