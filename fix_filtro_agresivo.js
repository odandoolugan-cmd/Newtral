const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Verificar si ya está
if (html.indexOf("// FIX FILTRO AGRESIVO") !== -1) {
    console.log("⚠️ Fix filtro agresivo ya existe");
    process.exit(0);
}

// Buscar el bloque de esPersonaValida
const oldBlock = `            function esPersonaValida(s) {
                if (!s || s.length < 3) return false;
                // Debe empezar con mayúscula (nombre propio)
                if (!/^[A-ZÁÉÍÓÚÑ]/.test(s)) return false;
                // No debe ser solo una palabra común
                const comunes = ["guerra","paz","amor","odio","vida","muerte","tiempo","mundo","historia","siglo","año","día","noche","hombre","mujer","niño","ciudad","país","tierra","agua","fuego","aire"];
                if (comunes.includes(s.toLowerCase())) return false;
                // No debe contener palabras como "de la", "del", "y" solas (indica frase, no nombre)
                if (/^(de|del|la|el|los|las|y|o|para|que|en|con|por)\\s/i.test(s)) return false;
                return true;
            }`;

if (html.indexOf(oldBlock) === -1) {
    console.log("❌ No se encontró esPersonaValida con el texto exacto");
    // Buscar aproximación
    const idx = html.indexOf("function esPersonaValida");
    if (idx !== -1) {
        console.log("Contexto:", JSON.stringify(html.substring(idx, idx + 600)));
    }
    process.exit(1);
}

const newBlock = `            // FIX FILTRO AGRESIVO: solo nombres propios reales
            function esPersonaValida(s) {
                if (!s || s.length < 3 || s.length > 40) return false;
                // Debe empezar con mayúscula (nombre propio)
                if (!/^[A-ZÁÉÍÓÚÑ]/.test(s)) return false;
                // No debe terminar con puntuación
                if (/[.,:;!?¿¡]\\s*$/.test(s)) return false;
                // No debe contener ":" o "." en medio
                if (/[:.]/.test(s)) return false;
                // No debe ser una frase con palabras comunes (de, la, el, los, las, y, o, para, que, en, con, por, del, al)
                if (/\\b(de|del|la|el|los|las|y|o|para|que|en|con|por|al)\\b/i.test(s)) {
                    // Excepción: "de" en apellidos compuestos como "García de la Torre"
                    // Pero si hay 2+ palabras comunes, es frase
                    const comunesCount = (s.match(/\\b(de|del|la|el|los|las|y|o|para|que|en|con|por|al)\\b/gi) || []).length;
                    if (comunesCount >= 2) return false;
                }
                // No debe ser palabra común sola
                const comunes = ["guerra","paz","amor","odio","vida","muerte","tiempo","mundo","historia","siglo","año","día","noche","hombre","mujer","niño","ciudad","país","tierra","agua","fuego","aire","biblioteca","reunión","comisión","directores","consejo","asamblea","grupo","equipo","partido","iglesia","estado","gobierno","imperio","reino","dinastía","cultura","arte","ciencia","literatura","filosofía","religión","educación","medios","clases","género","etnia","migración","urbanización"];
                if (comunes.includes(s.toLowerCase())) return false;
                // No debe ser 2+ palabras comunes (indica frase, no nombre)
                const palabras = s.split(/\\s+/);
                if (palabras.length >= 2) {
                    const comunesEnFrase = palabras.filter(p => comunes.includes(p.toLowerCase())).length;
                    if (comunesEnFrase >= 2) return false;
                }
                // Si tiene 3+ palabras y contiene "de", es probablemente lugar/organización
                if (palabras.length >= 3 && /\\bde\\b/i.test(s)) return false;
                return true;
            }`;

html = html.replace(oldBlock, newBlock);
fs.writeFileSync("index.html", html);
console.log("✅ Filtro agresivo insertado");
