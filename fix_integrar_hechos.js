const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

if (html.indexOf("SetunHechos.analizar") !== -1) {
    console.log("⚠️ SetunHechos.analizar ya integrado");
    process.exit(0);
}

// Buscar la sección 5 (Hechos Clave)
const startMarker = "// SECCIÓN 5: Hechos Clave";
const endMarker = "// SECCIÓN 6:"; // o lo que venga después

const startIdx = html.indexOf(startMarker);
if (startIdx === -1) {
    console.log("❌ No se encontró SECCIÓN 5");
    process.exit(1);
}

// Buscar el final de la sección 5 (hasta el siguiente comentario de sección)
const nextSection = html.indexOf("// SECCIÓN 6", startIdx);
const altNext = html.indexOf("// SECCIÓN", startIdx + 20);
const endIdx = nextSection !== -1 ? nextSection : (altNext !== -1 ? altNext : html.indexOf("analisis += ", startIdx + 500));

if (endIdx === -1 || endIdx <= startIdx) {
    console.log("❌ No se encontró el fin de SECCIÓN 5");
    console.log("Contexto:", JSON.stringify(html.substring(startIdx, startIdx + 500)));
    process.exit(1);
}

const newBlock = `// SECCIÓN 5: Hechos Clave (extraídos de las fuentes)
    const textoFuentesHechos = (datos.fuentes ? Object.values(datos.fuentes).flatMap(f => f?.data || []).map(d => (d.titulo || '') + ' ' + (d.resumen || '')).join(' ') : '') + ' ' + (wiki?.resumen || '');
    
    if (window.SetunHechos) {
        const hechosData = window.SetunHechos.analizar(textoFuentesHechos);
        
        if (hechosData.hechos.length > 0) {
            analisis += 'Hechos Clave (' + hechosData.hechos.length + ' extraídos):\\n\\n';
            hechosData.hechos.slice(0, 6).forEach((h, i) => {
                analisis += (i + 1) + '. ' + h + '\\n';
            });
            analisis += '\\n';
        } else {
            analisis += 'Hechos Clave:\\n\\n';
            analisis += '1. Origen y detonantes: ' + titulo + ' se desarrolló en ' + era + '.\\n';
            analisis += '2. Desarrollo y protagonistas: Se identificaron ' + (entidadesRust.length || 0) + ' entidades clave.\\n';
            analisis += '3. Consecuencias: Las consecuencias se extendieron por décadas.\\n\\n';
        }
        
        if (hechosData.consecuencias.length > 0) {
            analisis += 'Consecuencias (' + hechosData.consecuencias.length + '):\\n\\n';
            hechosData.consecuencias.slice(0, 4).forEach(c => {
                analisis += '• ' + c + '\\n';
            });
            analisis += '\\n';
        }
        
        if (hechosData.lecciones.length > 0) {
            analisis += 'Lecciones (' + hechosData.lecciones.length + '):\\n\\n';
            hechosData.lecciones.slice(0, 4).forEach(l => {
                analisis += '• ' + l + '\\n';
            });
            analisis += '\\n';
        }
    } else {
        analisis += 'Hechos Clave:\\n\\n';
        analisis += '1. Origen y detonantes: ' + titulo + ' se desarrolló en ' + era + '.\\n';
        analisis += '2. Desarrollo y protagonistas: Se identificaron ' + (entidadesRust.length || 0) + ' entidades clave.\\n';
        analisis += '3. Consecuencias: Las consecuencias se extendieron por décadas.\\n\\n';
    }
    
    `;

html = html.substring(0, startIdx) + newBlock + html.substring(endIdx);
fs.writeFileSync("index.html", html);
console.log("✅ SetunHechos integrado en análisis");
