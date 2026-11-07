const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

if (html.indexOf("SetunNLP_UNIVERSAL") !== -1) {
    console.log("⚠️ SetunNLP_UNIVERSAL ya existe");
    process.exit(0);
}

// Insertar ANTES del marker del panel de debug
const marker = "console.log(\"🔍 Panel de debug activado\");";
if (html.indexOf(marker) === -1) {
    console.log("❌ No se encontró el marker");
    process.exit(1);
}

const universal = `
    // ═══════════════════════════════════════════════════════════
    // SetunNLP_UNIVERSAL: NLP multi-idioma (español + inglés + genérico)
    // ═══════════════════════════════════════════════════════════
    (function() {
        if (window.SetunNLP_UNIVERSAL) return;

        // Detección de idioma simple (reglas)
        function detectarIdioma(texto) {
            const t = (texto || "").toLowerCase();
            // Palabras comunes español
            const es = (t.match(/\\b(el|la|los|las|de|del|que|en|un|una|por|para|con|sin|sobre|entre|durante|según|seg.n|también|tambi.n|pero|sino|porque|aunque|mientras|cuando|donde|como)\\b/g) || []).length;
            // Palabras comunes inglés
            const en = (t.match(/\\b(the|of|and|to|in|is|was|were|are|been|being|have|has|had|do|does|did|will|would|could|should|may|might|must|can|this|that|these|those|with|from|by|for|on|at|as|but|or|if|then|than|so|such|into|through|during|before|after|above|below|between|under|over)\\b/g) || []).length;
            if (es > en * 1.2) return "es";
            if (en > es * 1.2) return "en";
            return "multi"; // mezcla o desconocido
        }

        // Reglas genéricas multi-idioma (fechas, números, mayúsculas)
        const MESES_ES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
        const MESES_EN = ["january","february","march","april","may","june","july","august","september","october","november","december"];

        function extraerFechasUniversal(texto) {
            const fechas = new Set();
            let m;
            // Años con a.C./d.C./BC/AD
            const reAnio = /\\b(\\d{3,4})\\s*(a\\.?\\s*C\\.?|d\\.?\\s*C\\.?|AC|DC|BC|AD|a\\.C\\.|d\\.C\\.|B\\.C\\.|A\\.D\\.)?\\b/gi;
            while ((m = reAnio.exec(texto)) !== null) {
                const anio = parseInt(m[1]);
                if (anio > 0 && anio < 2100) fechas.add(m[1] + (m[2] ? " " + m[2].replace(/\\s+/g, "") : ""));
            }
            // Siglos (español e inglés)
            const reSiglo = /\\b(siglo|century)\\s+([IVXLCDM]+|\\d{1,2})\\b/gi;
            while ((m = reSiglo.exec(texto)) !== null) {
                fechas.add(m[1] + " " + m[2].toUpperCase());
            }
            // Mes + año (español)
            const reMesES = new RegExp("\\\\b(" + MESES_ES.join("|") + ")\\\\s+(?:de\\\\s+)?(\\\\d{4})\\\\b", "gi");
            while ((m = reMesES.exec(texto)) !== null) {
                fechas.add(m[1] + " " + m[2]);
            }
            // Mes + año (inglés)
            const reMesEN = new RegExp("\\\\b(" + MESES_EN.join("|") + ")\\\\s+(\\\\d{4})\\\\b", "gi");
            while ((m = reMesEN.exec(texto)) !== null) {
                fechas.add(m[1] + " " + m[2]);
            }
            // Fechas tipo "12 de noviembre de 1778" o "November 12, 1778"
            const reFechaES = /\\b(\\d{1,2})\\s+de\\s+([a-záéíóúñ]+)\\s+(?:de\\s+)?(\\d{3,4})\\b/gi;
            while ((m = reFechaES.exec(texto)) !== null) {
                fechas.add(m[1] + " de " + m[2] + " de " + m[3]);
            }
            return Array.from(fechas);
        }

        // Limpiar entidades (quitar puntuación, espacios extra)
        function limpiarEntidad(s) {
            return String(s || "")
                .replace(/[.,:;!?¿¡"'"'()[\\]{}]+$/g, "")
                .replace(/^[.,:;!?¿¡"'"'()[\\]{}]+/g, "")
                .replace(/\\s+/g, " ")
                .trim();
        }

        // Filtrar falsos positivos comunes
        const STOPWORDS = new Set([
            "el","la","los","las","un","una","unos","unas","de","del","al","a","en","por","para","con","sin","sobre","entre","durante","según","como","que","y","o","pero","sino","porque","aunque","mientras","cuando","donde","este","esta","estos","estas","ese","esa","esos","esas","aquel","aquella","aquellos","aquellas","mi","tu","su","nuestro","vuestro","su","the","a","an","of","and","or","but","in","on","at","to","from","by","for","with","without","about","between","during","after","before","above","below","under","over","this","that","these","those","my","your","his","her","its","our","their"
        ]);

        function filtrarEntidades(arr) {
            const seen = new Set();
            const out = [];
            for (const item of (arr || [])) {
                const limpio = limpiarEntidad(item);
                if (!limpio) continue;
                if (limpio.length < 2) continue;
                if (STOPWORDS.has(limpio.toLowerCase())) continue;
                const key = limpio.toLowerCase();
                if (seen.has(key)) continue;
                seen.add(key);
                out.push(limpio);
            }
            return out.slice(0, 30);
        }

        // Analizar texto multilingüe
        function analizar(texto) {
            const idioma = detectarIdioma(texto);
            let personas = [], lugares = [], organizaciones = [], fechas = [];

            // 1. Siempre usar compromise (inglés, pero extrae nombres propios)
            if (window.SetunNLP && window.SetunNLP.nlp) {
                try {
                    const nlpData = window.SetunNLP.extraerTodo(texto);
                    personas = personas.concat(nlpData.personas || []);
                    lugares = lugares.concat(nlpData.lugares || []);
                    organizaciones = organizaciones.concat(nlpData.organizaciones || []);
                    fechas = fechas.concat(nlpData.fechas || []);
                } catch(e) {}
            }

            // 2. Si es español o multi, usar SetunNLP_ES
            if ((idioma === "es" || idioma === "multi") && window.SetunNLP_ES) {
                try {
                    const esData = window.SetunNLP_ES.analizar(texto);
                    personas = personas.concat(esData.personas || []);
                    lugares = lugares.concat(esData.lugares || []);
                    organizaciones = organizaciones.concat(esData.organizaciones || []);
                    fechas = fechas.concat(esData.fechas || []);
                } catch(e) {}
            }

            // 3. Reglas genéricas (fechas, siempre)
            try {
                fechas = fechas.concat(extraerFechasUniversal(texto));
            } catch(e) {}

            // 4. Limpiar y fusionar
            return {
                idioma: idioma,
                personas: filtrarEntidades(personas),
                lugares: filtrarEntidades(lugares),
                organizaciones: filtrarEntidades(organizaciones),
                fechas: filtrarEntidades(fechas)
            };
        }

        window.SetunNLP_UNIVERSAL = {
            detectarIdioma: detectarIdioma,
            analizar: analizar,
            extraerFechas: extraerFechasUniversal
        };

        console.log("✅ SetunNLP_UNIVERSAL cargado (multi-idioma)");
    })();

    `;

html = html.replace(marker, universal + marker);
fs.writeFileSync("index.html", html);
console.log("✅ SetunNLP_UNIVERSAL insertado");
