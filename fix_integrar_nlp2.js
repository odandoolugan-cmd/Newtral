const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Verificar si ya está integrado
if (html.indexOf("SetunNLP_ES.analizar") !== -1) {
    console.log("⚠️ SetunNLP_ES.analizar ya está integrado");
    process.exit(0);
}

// Regex flexible: captura desde el comentario hasta el console.log de NLP
const regex = /(\/\/ Usar SetunNLP \(compromise\) para extraer entidades\s*\n\s*if \(window\.SetunNLP\) \{[\s\S]*?console\.log\("✅ NLP: " \+ nlpData\.personas\.length[^\n]*\n\s*\})/;

if (!regex.test(html)) {
    console.log("❌ No se encontró el bloque con regex");
    // Buscar contexto
    const idx = html.indexOf("Usar SetunNLP (compromise) para extraer entidades");
    if (idx !== -1) {
        console.log("Contexto:", JSON.stringify(html.substring(idx, idx + 800)));
    }
    process.exit(1);
}

const newBlock = [
'// Usar SetunNLP (compromise) + SetunNLP_ES (reglas español) para extraer entidades',
'            let personas = [], lugares = [], organizaciones = [], fechas = [];',
'            if (window.SetunNLP) {',
'                const nlpData = window.SetunNLP.extraerTodo(textoFuentes);',
'                personas = nlpData.personas || [];',
'                lugares = nlpData.lugares || [];',
'                organizaciones = nlpData.organizaciones || [];',
'                fechas = nlpData.fechas || [];',
'            }',
'            // Complementar con reglas español',
'            if (window.SetunNLP_ES) {',
'                const esData = window.SetunNLP_ES.analizar(textoFuentes);',
'                const merge = (a, b) => {',
'                    const set = new Set((a || []).map(x => String(x).toLowerCase().trim()));',
'                    const out = [...(a || [])];',
'                    for (const item of (b || [])) {',
'                        const key = String(item).toLowerCase().trim();',
'                        if (!set.has(key)) { out.push(item); set.add(key); }',
'                    }',
'                    return out;',
'                };',
'                personas = merge(personas, esData.personas);',
'                lugares = merge(lugares, esData.lugares);',
'                organizaciones = merge(organizaciones, esData.organizaciones);',
'                fechas = merge(fechas, esData.fechas);',
'            }',
'            window._nlpPersonas = personas;',
'            window._nlpLugares = lugares;',
'            window._nlpOrganizaciones = organizaciones;',
'            window._nlpFechas = fechas;',
'            console.log("✅ NLP: " + personas.length + " personas, " + lugares.length + " lugares, " + organizaciones.length + " organizaciones, " + fechas.length + " fechas");',
'            if (personas.length > 0) console.log("   👤 Personas:", personas.slice(0, 5).join(", "));',
'            if (lugares.length > 0) console.log("   📍 Lugares:", lugares.slice(0, 5).join(", "));',
'            if (fechas.length > 0) console.log("   📅 Fechas:", fechas.slice(0, 5).join(", "));'
].join('\n');

const match = html.match(regex);
if (!match) {
    console.log("❌ match falló");
    process.exit(1);
}

html = html.replace(regex, newBlock);
fs.writeFileSync("index.html", html);
console.log("✅ Integración SetunNLP + SetunNLP_ES completada (vía regex)");
