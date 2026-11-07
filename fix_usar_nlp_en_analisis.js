const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Verificar si ya está
if (html.indexOf("// FIX USAR NLP EN ANÁLISIS") !== -1) {
    console.log("⚠️ Fix ya existe");
    process.exit(0);
}

// Buscar la sección 3 (Figuras y Entidades)
const oldBlock = `            // SECCIÓN 3: Figuras y Entidades
            if (entidadesRust.length > 0) {
                analisis += 'Figuras y Entidades (' + entidadesRust.length + ' identificadas):\\n\\n';
                entidadesRust.slice(0, 15).forEach(e => {
                    analisis += '• ' + e + '\\n';
                });
                analisis += '\\nEl estudio prosopográfico de estas entidades permite reconstruir las redes de poder, influencia y resistencia que operaban en ' + era + '.\\n\\n';
            }`;

if (html.indexOf(oldBlock) === -1) {
    console.log("❌ No se encontró la sección 3");
    const idx = html.indexOf("SECCIÓN 3");
    if (idx !== -1) {
        console.log("Contexto:", JSON.stringify(html.substring(idx, idx + 600)));
    }
    process.exit(1);
}

const newBlock = `            // FIX USAR NLP EN ANÁLISIS: usar personas/lugares del NLP (limpio) + Rust
            const figurasNLP = (window._nlpPersonas || []).slice(0, 10);
            const lugaresNLP = (window._nlpLugares || []).slice(0, 10);
            const fechasNLP = (window._nlpFechas || []).slice(0, 10);
            const totalFiguras = figurasNLP.length + lugaresNLP.length + fechasNLP.length;

            if (totalFiguras > 0) {
                analisis += 'Figuras y Entidades (' + totalFiguras + ' identificadas):\\n\\n';
                if (figurasNLP.length > 0) {
                    analisis += '👤 Personas:\\n';
                    figurasNLP.forEach(e => { analisis += '  • ' + e + '\\n'; });
                    analisis += '\\n';
                }
                if (lugaresNLP.length > 0) {
                    analisis += '📍 Lugares:\\n';
                    lugaresNLP.forEach(e => { analisis += '  • ' + e + '\\n'; });
                    analisis += '\\n';
                }
                if (fechasNLP.length > 0) {
                    analisis += '📅 Fechas:\\n';
                    fechasNLP.forEach(e => { analisis += '  • ' + e + '\\n'; });
                    analisis += '\\n';
                }
                analisis += 'El estudio prosopográfico de estas entidades permite reconstruir las redes de poder, influencia y resistencia que operaban en ' + era + '.\\n\\n';
            } else if (entidadesRust.length > 0) {
                // Fallback: usar Rust si NLP falla
                analisis += 'Figuras y Entidades (' + entidadesRust.length + ' identificadas):\\n\\n';
                entidadesRust.slice(0, 15).forEach(e => {
                    analisis += '• ' + e + '\\n';
                });
                analisis += '\\nEl estudio prosopográfico de estas entidades permite reconstruir las redes de poder, influencia y resistencia que operaban en ' + era + '.\\n\\n';
            }`;

html = html.replace(oldBlock, newBlock);
fs.writeFileSync("index.html", html);
console.log("✅ Fix USAR NLP EN ANÁLISIS insertado");
