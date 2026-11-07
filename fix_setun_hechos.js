const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

if (html.indexOf("SetunHechos") !== -1) {
    console.log("⚠️ SetunHechos ya existe");
    process.exit(0);
}

const marker = "console.log(\"🔍 Panel de debug activado\");";
if (html.indexOf(marker) === -1) {
    console.log("❌ No se encontró el marker");
    process.exit(1);
}

const setunHechos = `
    // ═══════════════════════════════════════════════════════════
    // SetunHechos: extraer hechos reales de las fuentes
    // ═══════════════════════════════════════════════════════════
    (function() {
        if (window.SetunHechos) return;

        // Verbos de acción histórica
        const VERBOS_ACCION = [
            "ordenó", "ordenó", "decretó", "proclamó", "declaró", "estableció",
            "fundó", "construyó", "destruyó", "quemó", "saqueó", "conquistó",
            "invadió", "asesinó", "ejecutó", "encarceló", "exilió", "derrotó",
            "venció", "firmó", "promulgó", "derogó", "reformó", "cambió",
            "inició", "comenzó", "terminó", "finalizó", "colapsó", "cayó",
            "surgió", "nació", "murió", "falleció", "sucedió", "heredó",
            "reinó", "gobernó", "dirigió", "lideró", "comandó", "organizó"
        ];

        // Verbos de consecuencia
        const VERBOS_CONSECUENCIA = [
            "provocó", "causó", "generó", "produjo", "ocasionó", "desencadenó",
            "conllevó", "implicó", "significó", "representó", "supuso",
            "permitió", "facilitó", "dificultó", "impidió", "evitó"
        ];

        // Extraer oraciones con hechos
        function extraerHechos(texto, maxHechos = 10) {
            if (!texto) return [];
            
            // Dividir en oraciones
            const oraciones = texto
                .replace(/([.!?])\\s+/g, "$1|")
                .split("|")
                .map(s => s.trim())
                .filter(s => s.length > 30 && s.length < 300);

            const hechos = [];
            const seen = new Set();

            for (const oracion of oraciones) {
                // Debe contener un verbo de acción o consecuencia
                const tieneVerbo = VERBOS_ACCION.some(v => oracion.toLowerCase().includes(v)) ||
                                  VERBOS_CONSECUENCIA.some(v => oracion.toLowerCase().includes(v));
                
                // Debe contener una fecha o año
                const tieneFecha = /\\b\\d{3,4}\\s*(a\\.?\\s*C\\.?|d\\.?\\s*C\\.?)?\\b/.test(oracion) ||
                                  /\\bsiglo\\s+[IVXLCDM]+\\b/i.test(oracion);
                
                // Debe contener una entidad (mayúscula)
                const tieneEntidad = /[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+/.test(oracion);

                if (tieneVerbo && (tieneFecha || tieneEntidad)) {
                    const key = oracion.toLowerCase().substring(0, 50);
                    if (!seen.has(key)) {
                        seen.add(key);
                        hechos.push(oracion);
                    }
                }

                if (hechos.length >= maxHechos) break;
            }

            return hechos;
        }

        // Extraer consecuencias
        function extraerConsecuencias(texto) {
            if (!texto) return [];
            
            const oraciones = texto
                .replace(/([.!?])\\s+/g, "$1|")
                .split("|")
                .map(s => s.trim())
                .filter(s => s.length > 30 && s.length < 300);

            const consecuencias = [];
            const seen = new Set();

            for (const oracion of oraciones) {
                const tieneConsecuencia = VERBOS_CONSECUENCIA.some(v => oracion.toLowerCase().includes(v)) ||
                                          /\\b(como resultado|por lo tanto|en consecuencia|debido a|a causa de|gracias a)\\b/i.test(oracion);
                
                if (tieneConsecuencia) {
                    const key = oracion.toLowerCase().substring(0, 50);
                    if (!seen.has(key)) {
                        seen.add(key);
                        consecuencias.push(oracion);
                    }
                }

                if (consecuencias.length >= 5) break;
            }

            return consecuencias;
        }

        // Extraer lecciones (oraciones con "lección", "enseñanza", "aprendizaje")
        function extraerLecciones(texto) {
            if (!texto) return [];
            
            const oraciones = texto
                .replace(/([.!?])\\s+/g, "$1|")
                .split("|")
                .map(s => s.trim())
                .filter(s => s.length > 30 && s.length < 300);

            const lecciones = [];
            const seen = new Set();

            for (const oracion of oraciones) {
                const tieneLeccion = /\\b(lección|enseñanza|aprendizaje|moraleja|conclusión|reflexión|nos enseña|demuestra que|muestra que|revela que)\\b/i.test(oracion);
                
                if (tieneLeccion) {
                    const key = oracion.toLowerCase().substring(0, 50);
                    if (!seen.has(key)) {
                        seen.add(key);
                        lecciones.push(oracion);
                    }
                }

                if (lecciones.length >= 5) break;
            }

            return lecciones;
        }

        window.SetunHechos = {
            extraerHechos: extraerHechos,
            extraerConsecuencias: extraerConsecuencias,
            extraerLecciones: extraerLecciones,
            analizar: function(texto) {
                return {
                    hechos: extraerHechos(texto),
                    consecuencias: extraerConsecuencias(texto),
                    lecciones: extraerLecciones(texto)
                };
            }
        };

        console.log("✅ SetunHechos cargado (extrae hechos reales)");
    })();

    `;

html = html.replace(marker, setunHechos + marker);
fs.writeFileSync("index.html", html);
console.log("✅ SetunHechos insertado");
