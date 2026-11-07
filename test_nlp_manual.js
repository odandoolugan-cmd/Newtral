const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

if (html.indexOf("TEST_NLP_MANUAL") !== -1) {
    console.log("⚠️ Test NLP manual ya existe");
    process.exit(0);
}

const marker = "console.log(\"=== DIAGNÓSTICO ===\");";
if (html.indexOf(marker) === -1) {
    console.log("❌ No se encontró el marker de diagnóstico");
    process.exit(1);
}

const testNLP = `
        // TEST_NLP_MANUAL: Probar NLP con texto de ejemplo
        setTimeout(() => {
            const textoTest = "Julio César llegó a Alejandría en el año 48 a.C. durante las guerras civiles. Cleopatra VII y Ptolomeo XIII luchaban por el trono de Egipto. La Biblioteca de Alejandría fue fundada por Ptolomeo I en el siglo III a.C.";
            if (window.SetunNLP) {
                console.log("=== TEST NLP (compromise) ===");
                const nlpData = window.SetunNLP.extraerTodo(textoTest);
                console.log("👤 Personas (compromise):", nlpData.personas.length, nlpData.personas.slice(0, 5));
                console.log("📍 Lugares (compromise):", nlpData.lugares.length, nlpData.lugares.slice(0, 5));
                console.log("📅 Fechas (compromise):", nlpData.fechas.length, nlpData.fechas.slice(0, 5));
            }
            if (window.SetunNLP_ES) {
                console.log("=== TEST NLP (SetunNLP_ES) ===");
                const esData = window.SetunNLP_ES.analizar(textoTest);
                console.log("👤 Personas (ES):", esData.personas.length, esData.personas.slice(0, 5));
                console.log("📍 Lugares (ES):", esData.lugares.length, esData.lugares.slice(0, 5));
                console.log("🏢 Organizaciones (ES):", esData.organizaciones.length, esData.organizaciones.slice(0, 5));
                console.log("📅 Fechas (ES):", esData.fechas.length, esData.fechas.slice(0, 5));
            }
        }, 4000);
        
        `;

html = html.replace(marker, testNLP + marker);
fs.writeFileSync("index.html", html);
console.log("✅ TEST_NLP_MANUAL insertado");
