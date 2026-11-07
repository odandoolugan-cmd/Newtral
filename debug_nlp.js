const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Buscar donde se llama a SetunNLP
const marker = "const doc = this.nlp(texto);";
if (html.indexOf(marker) === -1) {
    console.log("❌ No se encontró 'const doc = this.nlp(texto);'");
    process.exit(1);
}

// Añadir log después de la primera línea
const lines = html.split('\n');
let found = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("const doc = this.nlp(texto);")) {
        // Añadir log en la siguiente línea
        if (i + 1 < lines.length) {
            const indent = lines[i].match(/^(\s*)/)[1];
            lines[i + 1] = indent + 'if (window.DEBUG_NLP) console.log("🔬 NLP doc:", doc ? "OK" : "NULL");\n' + lines[i + 1];
            found = true;
            break;
        }
    }
}

if (!found) {
    console.log("❌ No se pudo insertar el log");
    process.exit(1);
}

html = lines.join('\n');
fs.writeFileSync("index.html", html);
console.log("✅ Log de NLP insertado");
