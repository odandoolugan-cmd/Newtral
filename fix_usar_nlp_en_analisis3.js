const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

if (html.indexOf("// FIX USAR NLP EN ANÁLISIS") !== -1) {
    console.log("⚠️ Fix ya existe");
    process.exit(0);
}

// Buscar inicio y fin por índices
const startMarker = "// SECCIÓN 3: Figuras y Entidades";
const endMarker = "// SECCIÓN 4: Citas y Referencias";

const startIdx = html.indexOf(startMarker);
if (startIdx === -1) {
    console.log("❌ No se encontró startMarker");
    process.exit(1);
}

const endIdx = html.indexOf(endMarker, startIdx);
if (endIdx === -1) {
    console.log("❌ No se encontró endMarker");
    process.exit(1);
}

const oldBlock = html.substring(startIdx, endIdx);

// Verificar que contiene entidadesRust
if (oldBlock.indexOf("entidadesRust") === -1) {
    console.log("⚠️ El bloque no contiene entidadesRust, no se modifica");
    process.exit(0);
}

const newBlock = `// FIX USAR NLP EN ANÁLISIS: usar personas/lugares del NLP (limpio)
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
        analisis += 'Figuras y Entidades (' + entidadesRust.length + ' identificadas):\\n\\n';
        entidadesRust.slice(0, 15).forEach(e => {
            analisis += '• ' + e + '\\n';
        });
        analisis += '\\nEl estudio prosopográfico de estas entidades permite reconstruir las redes de poder, influencia y resistencia que operaban en ' + era + '.\\n\\n';
    }
    
    `;

html = html.substring(0, startIdx) + newBlock + html.substring(endIdx);
fs.writeFileSync("index.html", html);
console.log("✅ Fix USAR NLP EN ANÁLISIS insertado (por índices)");
