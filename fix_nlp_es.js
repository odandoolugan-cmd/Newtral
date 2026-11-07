const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// Verificar que no está ya
if (html.indexOf("SetunNLP_ES") !== -1) {
    console.log("⚠️ SetunNLP_ES ya existe");
    process.exit(0);
}

// Buscar el script del panel de debug para insertar ANTES
const marker = "console.log(\"🔍 Panel de debug activado\");";
if (html.indexOf(marker) === -1) {
    console.log("❌ No se encontró el marker del panel");
    process.exit(1);
}

const nlpES = `
    // ═══════════════════════════════════════════════════════════
    // SetunNLP_ES: Reglas para español (complementa compromise)
    // ═══════════════════════════════════════════════════════════
    (function() {
        if (window.SetunNLP_ES) return;

        // Diccionarios
        const PAISES = ["España", "Francia", "Alemania", "Italia", "Portugal", "Inglaterra", "Reino Unido", "Rusia", "China", "Japón", "India", "Egipto", "Grecia", "Roma", "Turquía", "Bizancio", "Imperio Bizantino", "Imperio Romano", "Imperio Otomano", "Persia", "Mongolia", "América", "Europa", "Asia", "África", "Oceanía", "Estados Unidos", "México", "Argentina", "Brasil", "Colombia", "Perú", "Chile", "Cuba", "Venezuela"];

        const CIUDADES = ["Madrid", "Barcelona", "Sevilla", "Toledo", "Granada", "Córdoba", "Valencia", "Roma", "Atenas", "Constantinopla", "Estambul", "Jerusalén", "Alejandría", "El Cairo", "Bagdad", "Damasco", "París", "Londres", "Berlín", "Moscú", "Pekín", "Kioto", "Tokio", "Delhi", "Tenochtitlán", "Cuzco", "Cartagena", "Cartago", "Tiro", "Sidón", "Babilonia", "Nínive", "Persépolis", "Tebas", "Esparta", "Corinto", "Éfeso", "Antioquía", "Nicea", "Rávena", "Venecia", "Génova", "Florencia", "Milán", "Nápoles", "Viena", "Praga", "Varsovia", "Kiev", "Novgorod"];

        const RIOS_MONTANAS = ["Nilo", "Éufrates", "Tigris", "Danubio", "Rin", "Ródano", "Támesis", "Sena", "Ebro", "Guadalquivir", "Tajo", "Duero", "Río Amarillo", "Yangtsé", "Ganges", "Indo", "Amazonas", "Orinoco", "Paraná", "Misisipi", "Alpes", "Pirineos", "Cárpatos", "Balcanes", "Himalaya", "Andes", "Urales", "Cáucaso", "Apeninos", "Atlas"];

        const ORGANIZACIONES = ["ONU", "UNESCO", "OTAN", "Unión Europea", "Iglesia Católica", "Vaticano", "Cruz Roja", "OMS", "FMI", "Banco Mundial", "OPEP", "Interpol", "NASA", "CERN", "Google", "Microsoft", "Apple", "Amazon", "Meta", "Facebook", "Twitter", "OpenAI", "Universidad de Oxford", "Universidad de Cambridge", "Universidad de Salamanca", "Universidad de Bolonia", "Real Academia Española"];

        const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

        // Regex para fechas
        const RE_ANIO = /\\b(\\d{3,4})\\s*(a\\.?\\s*C\\.?|d\\.?\\s*C\\.?|AC|DC|a\\.C\\.|d\\.C\\.)?\\b/g;
        const RE_SIGLO = /\\bsiglo\\s+([IVXLCDM]+)\\b/gi;
        const RE_MES_ANIO = new RegExp("\\\\b(" + MESES.join("|") + ")\\\\s+(?:de\\\\s+)?(\\\\d{4})\\\\b", "gi");
        const RE_FECHA_ES = /\\b(\\d{1,2})\\s+de\\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\\s+(?:de\\s+)?(\\d{3,4})\\b/gi;

        // Extraer personas: nombres propios (mayúscula inicial, 2+ palabras)
        // Excluye lugares conocidos
        function extraerPersonasES(texto) {
            const personas = new Set();
            // Nombres con 2-4 palabras, primera mayúscula, no en listas de lugares
            const re = /\\b([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+){1,3})\\b/g;
            let m;
            while ((m = re.exec(texto)) !== null) {
                const nombre = m[1].trim();
                if (nombre.length < 5) continue;
                if (PAISES.includes(nombre) || CIUDADES.includes(nombre)) continue;
                if (ORGANIZACIONES.includes(nombre)) continue;
                if (nombre.split(/\\s+/).some(p => PAISES.includes(p) || CIUDADES.includes(p))) continue;
                personas.add(nombre);
            }
            return Array.from(personas);
        }

        function extraerLugaresES(texto) {
            const lugares = new Set();
            for (const p of PAISES) if (texto.includes(p)) lugares.add(p);
            for (const c of CIUDADES) if (texto.includes(c)) lugares.add(c);
            for (const r of RIOS_MONTANAS) if (texto.includes(r)) lugares.add(r);
            return Array.from(lugares);
        }

        function extraerOrganizacionesES(texto) {
            const orgs = new Set();
            for (const o of ORGANIZACIONES) if (texto.includes(o)) orgs.add(o);
            return Array.from(orgs);
        }

        function extraerFechasES(texto) {
            const fechas = new Set();
            let m;
            // Años con a.C./d.C.
            while ((m = RE_ANIO.exec(texto)) !== null) {
                const anio = m[1];
                const era = m[2] ? m[2].replace(/\\s+/g, "") : "";
                fechas.add(anio + (era ? " " + era : ""));
            }
            // Siglos
            while ((m = RE_SIGLO.exec(texto)) !== null) {
                fechas.add("siglo " + m[1].toUpperCase());
            }
            // Mes + año
            while ((m = RE_MES_ANIO.exec(texto)) !== null) {
                fechas.add(m[1] + " " + m[2]);
            }
            // Fecha completa
            while ((m = RE_FECHA_ES.exec(texto)) !== null) {
                fechas.add(m[1] + " de " + m[2] + " de " + m[3]);
            }
            return Array.from(fechas);
        }

        window.SetunNLP_ES = {
            extraerPersonas: extraerPersonasES,
            extraerLugares: extraerLugaresES,
            extraerOrganizaciones: extraerOrganizacionesES,
            extraerFechas: extraerFechasES,
            analizar: function(texto) {
                return {
                    personas: extraerPersonasES(texto),
                    lugares: extraerLugaresES(texto),
                    organizaciones: extraerOrganizacionesES(texto),
                    fechas: extraerFechasES(texto)
                };
            }
        };

        console.log("✅ SetunNLP_ES cargado (reglas español)");
    })();

    `;

html = html.replace(marker, nlpES + marker);
fs.writeFileSync("index.html", html);
console.log("✅ SetunNLP_ES insertado");
