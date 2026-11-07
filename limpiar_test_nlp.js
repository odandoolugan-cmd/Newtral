const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Verificar si el test existe
if (html.indexOf("TEST_NLP_MANUAL") === -1) {
    console.log("⚠️ TEST_NLP_MANUAL no existe (ya limpiado)");
    process.exit(0);
}

// Buscar desde el inicio del test hasta el final
const startMarker = "        // TEST_NLP_MANUAL: Probar NLP con texto de ejemplo";
const endMarker = "        }, 4000);";

const startIdx = html.indexOf(startMarker);
if (startIdx === -1) {
    console.log("❌ No se encontró el inicio del test");
    process.exit(1);
}

const endIdx = html.indexOf(endMarker, startIdx);
if (endIdx === -1) {
    console.log("❌ No se encontró el fin del test");
    process.exit(1);
}

// Eliminar el bloque completo (incluyendo el `}, 4000);`)
const endFinal = endIdx + endMarker.length;

// Verificar que no haya un `\n` extra
let endClean = endFinal;
if (html[endClean] === '\n') endClean++;

html = html.substring(0, startIdx) + html.substring(endClean);
fs.writeFileSync("index.html", html);
console.log("✅ TEST_NLP_MANUAL eliminado");
console.log("   Eliminados:", endFinal - startIdx, "caracteres");
