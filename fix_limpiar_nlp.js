const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Verificar si ya está
if (html.indexOf("// FIX LIMPIEZA NLP") !== -1) {
    console.log("⚠️ Fix limpieza NLP ya existe");
    process.exit(0);
}

// Buscar el bloque de retorno de analizar() en SetunNLP_UNIVERSAL
const oldReturn = `            // 4. Limpiar y fusionar
            return {
                idioma: idioma,
                personas: filtrarEntidades(personas),
                lugares: filtrarEntidades(lugares),
                organizaciones: filtrarEntidades(organizaciones),
                fechas: filtrarEntidades(fechas)
            };`;

if (html.indexOf(oldReturn) === -1) {
    console.log("❌ No se encontró el bloque de retorno");
    process.exit(1);
}

const newReturn = `            // FIX LIMPIEZA NLP: filtrar ruido agresivamente
            function esPersonaValida(s) {
                if (!s || s.length < 3) return false;
                // Debe empezar con mayúscula (nombre propio)
                if (!/^[A-ZÁÉÍÓÚÑ]/.test(s)) return false;
                // No debe ser solo una palabra común
                const comunes = ["guerra","paz","amor","odio","vida","muerte","tiempo","mundo","historia","siglo","año","día","noche","hombre","mujer","niño","ciudad","país","tierra","agua","fuego","aire"];
                if (comunes.includes(s.toLowerCase())) return false;
                // No debe contener palabras como "de la", "del", "y" solas (indica frase, no nombre)
                if (/^(de|del|la|el|los|las|y|o|para|que|en|con|por)\\s/i.test(s)) return false;
                return true;
            }
            function esLugarValido(s) {
                if (!s || s.length < 3) return false;
                if (!/^[A-ZÁÉÍÓÚÑ]/.test(s)) return false;
                const comunes = ["para que","las","los","la","el","un","una","de","del","en","con","por"];
                if (comunes.includes(s.toLowerCase())) return false;
                return true;
            }
            function esFechaValida(s) {
                if (!s || s.length < 2) return false;
                // Debe contener al menos 3 dígitos o "siglo"
                if (/\\d{3,4}/.test(s)) return true;
                if (/siglo/i.test(s)) return true;
                if (/a\\.?\\s*C\\.?|d\\.?\\s*C\\.?|AC|DC/i.test(s)) return true;
                return false;
            }

            return {
                idioma: idioma,
                personas: filtrarEntidades(personas).filter(esPersonaValida),
                lugares: filtrarEntidades(lugares).filter(esLugarValido),
                organizaciones: filtrarEntidades(organizaciones).filter(esPersonaValida),
                fechas: filtrarEntidades(fechas).filter(esFechaValida)
            };`;

html = html.replace(oldReturn, newReturn);
fs.writeFileSync("index.html", html);
console.log("✅ Limpieza NLP insertada");
