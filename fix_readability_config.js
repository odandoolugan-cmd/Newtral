const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

if (html.indexOf("charThreshold: 100") !== -1) {
    console.log("⚠️ Readability config ya existe");
    process.exit(0);
}

// Buscar el bloque de Readability en SetunScraper
const oldBlock = `                    // Readability
                    let article = null;
                    if (window.Readability) {
                        try { article = new Readability(doc).parse(); } catch(e) {}
                    }`;

if (html.indexOf(oldBlock) === -1) {
    console.log("❌ No se encontró el bloque de Readability");
    // Buscar aproximación
    const idx = html.indexOf("new Readability(doc)");
    if (idx !== -1) {
        console.log("Contexto:", JSON.stringify(html.substring(idx - 200, idx + 200)));
    }
    process.exit(1);
}

const newBlock = `                    // Readability (config optimizada para más texto)
                    let article = null;
                    if (window.Readability) {
                        try {
                            const reader = new Readability(doc, {
                                charThreshold: 100,
                                keepClasses: false,
                                nbTopCandidates: 5,
                                classesToPreserve: []
                            });
                            article = reader.parse();
                        } catch(e) {}
                    }`;

html = html.replace(oldBlock, newBlock);
fs.writeFileSync("index.html", html);
console.log("✅ Readability config optimizada");
