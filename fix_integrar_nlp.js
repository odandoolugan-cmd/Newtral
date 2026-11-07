const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Bloque viejo
const oldBlock = `            // Usar SetunNLP (compromise) para extraer entidades
            if (window.SetunNLP) {
                const nlpData = window.SetunNLP.extraerTodo(textoFuentes);
                window._nlpPersonas = nlpData.personas;
                window._nlpLugares = nlpData.lugares;
                window._nlpOrganizaciones = nlpData.organizaciones;
                window._nlpFechas = nlpData.fechas;
                console.log("✅ NLP: " + nlpData.personas.length + " personas, " + nlpData.lugares.length + " lugares, " + nlpData.organizaciones.length + " organizaciones, " + nlpData.fechas.length + " fechas");
            }`;

// Verificar que existe
if (html.indexOf(oldBlock) === -1) {
    console.log("❌ No se encontró el bloque viejo");
    // Buscar aproximación
    const idx = html.indexOf("Usar SetunNLP (compromise) para extraer entidades");
    if (idx === -1) {
        console.log("❌ No se encontró ni el comentario");
        process.exit(1);
    }
    console.log("⚠️ Se encontró el comentario pero el bloque no coincide exactamente");
    const snippet = html.substring(idx - 50, idx + 600);
    console.log("Contexto:", JSON.stringify(snippet.substring(0, 300)));
    process.exit(1);
}

// Bloque nuevo (combina SetunNLP + SetunNLP_ES)
const newBlock = `            // Usar SetunNLP (compromise) + SetunNLP_ES (reglas español) para extraer entidades
            let personas = [], lugares = [], organizaciones = [], fechas = [];
            if (window.SetunNLP) {
                const nlpData = window.SetunNLP.extraerTodo(textoFuentes);
                personas = nlpData.personas || [];
                lugares = nlpData.lugares || [];
                organizaciones = nlpData.organizaciones || [];
                fechas = nlpData.fechas || [];
            }
            // Complementar con reglas español
            if (window.SetunNLP_ES) {
                const esData = window.SetunNLP_ES.analizar(textoFuentes);
                // Fusionar sin duplicados
                const merge = (a, b) => {
                    const set = new Set((a || []).map(x => String(x).toLowerCase().trim()));
                    const out = [...(a || [])];
                    for (const item of (b || [])) {
                        const key = String(item).toLowerCase().trim();
                        if (!set.has(key)) { out.push(item); set.add(key); }
                    }
                    return out;
                };
                personas = merge(personas, esData.personas);
                lugares = merge(lugares, esData.lugares);
                organizaciones = merge(organizaciones, esData.organizaciones);
                fechas = merge(fechas, esData.fechas);
            }
            window._nlpPersonas = personas;
            window._nlpLugares = lugares;
            window._nlpOrganizaciones = organizaciones;
            window._nlpFechas = fechas;
            console.log("✅ NLP: " + personas.length + " personas, " + lugares.length + " lugares, " + organizaciones.length + " organizaciones, " + fechas.length + " fechas");
            if (personas.length > 0) console.log("   👤 Personas:", personas.slice(0, 5).join(", "));
            if (lugares.length > 0) console.log("   📍 Lugares:", lugares.slice(0, 5).join(", "));
            if (fechas.length > 0) console.log("   📅 Fechas:", fechas.slice(0, 5).join(", "));`;

html = html.replace(oldBlock, newBlock);
fs.writeFileSync("index.html", html);
console.log("✅ Integración SetunNLP + SetunNLP_ES completada");
