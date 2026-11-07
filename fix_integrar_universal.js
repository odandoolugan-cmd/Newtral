const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Verificar si ya está
if (html.indexOf("SetunNLP_UNIVERSAL.analizar") !== -1) {
    console.log("⚠️ SetunNLP_UNIVERSAL.analizar ya integrado");
    process.exit(0);
}

// Regex flexible: captura desde "let personas = []" hasta el último console.log de NLP
const regex = /(\/\/ Usar SetunNLP \(compromise\) \+ SetunNLP_ES[\s\S]*?if \(fechas\.length > 0\) console\.log\("   📅 Fechas:", fechas\.slice\(0, 5\)\.join\(", "\)\);)/;

if (!regex.test(html)) {
    console.log("❌ No se encontró el bloque con regex");
    // Buscar contexto
    const idx = html.indexOf("SetunNLP_ES");
    if (idx !== -1) {
        console.log("Contexto:", JSON.stringify(html.substring(idx - 100, idx + 800)));
    }
    process.exit(1);
}

const newBlock = [
'// Usar SetunNLP_UNIVERSAL (multi-idioma: compromise + ES + genérico)',
'            let personas = [], lugares = [], organizaciones = [], fechas = [];',
'            if (window.SetunNLP_UNIVERSAL) {',
'                const uniData = window.SetunNLP_UNIVERSAL.analizar(textoFuentes);',
'                personas = uniData.personas || [];',
'                lugares = uniData.lugares || [];',
'                organizaciones = uniData.organizaciones || [];',
'                fechas = uniData.fechas || [];',
'                console.log("🌐 Idioma detectado: " + uniData.idioma);',
'            } else if (window.SetunNLP) {',
'                const nlpData = window.SetunNLP.extraerTodo(textoFuentes);',
'                personas = nlpData.personas || [];',
'                lugares = nlpData.lugares || [];',
'                organizaciones = nlpData.organizaciones || [];',
'                fechas = nlpData.fechas || [];',
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
console.log("✅ Integración SetunNLP_UNIVERSAL completada");
