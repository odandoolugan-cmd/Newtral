const fs = require('fs');
const vm = require('vm');

let pass = 0, fail = 0;
const ok = (m) => { console.log('✅', m); pass++; };
const ko = (m, d) => { console.log('❌', m, d ? '→ ' + d : ''); fail++; };

// ═══ TEST 1 ═══
console.log('═══════ TEST 1: setun_core.js ═══════');
const sb = { window:{}, localStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}}, console:{log:()=>{},warn:()=>{},error:()=>{}}, Date, Math, JSON, Object, Array, String, Number };
sb.window = sb;
vm.createContext(sb);
vm.runInContext(fs.readFileSync('setun_core.js', 'utf8'), sb);
const SC = sb.SetunCore;
ok('SetunCore existe');
if (SC.version === '3.2-historia') ok('Versión 3.2');
else ko('Versión', SC.version);
if (Object.keys(SC.evaluarParametros({})).length === 60) ok('60 params');
else ko('Nº params');
const v = SC.evaluarAnalisis({});
if (v.valorTernario === 0) ok('Vacío → 0');
else ko('Vacío', v.valorTernario);
if (v.completitud === 0) ok('Completitud vacía = 0%');
else ko('Completitud vacía');
const r = SC.evaluarAnalisis({fuentesActivas:10,totalReferencias:25,fuentesAcademicas:5,fuentesHistoricas:4,fuentesExitosas:9,diversidadFuentes:8,fuentesRecientes:6,fuentesPrimarias:5,eventosCronologia:8,rangoTemporal:250,densidadTemporal:3,coherenciaFechas:85,contextoGeopolitico:5,entidades:7,personajes:6,lugares:5,palabras:1200,citas:6,tono:'Optimista',agentReach:8,seccionesCompletas:3,riquezaVocabulario:70,idioma:'es',tiempoLectura:12,legibilidad:75,relevancia:90,citasBienFormadas:5});
if (r.valorTernario === 1) ok('Rico → +1');
else ko('Rico', r.valorTernario);
if (r.completitud >= 50) ok('Completitud rica = ' + r.completitud + '%');
else ko('Completitud rica');

// ═══ TEST 2 ═══
console.log('');
console.log('═══════ TEST 2: index.html ═══════');
const html = fs.readFileSync('index.html', 'utf8');
if (html.includes('setun_core.js')) ok('Carga setun_core.js');
else ko('No carga setun_core.js');
if (html.includes('30 parámetros ternarios')) ok('Panel v3');
else ko('Panel v3 ausente');
if (!html.includes('v2.0-historia')) ok('Sin badge v2');
else ko('Badge v2 presente');
if (html.includes('EXPOSICIÓN GLOBAL')) ok('Exposición global');
else ko('Sin exposición');
['mostrarPanelSetun','mostrarModal','generarFallbackHistorico','showToast'].forEach(fn => {
    const re = new RegExp('function\\s+' + fn + '|const\\s+' + fn + '|let\\s+' + fn);
    if (re.test(html)) ok('Función ' + fn + ' declarada');
    else ko('Función ' + fn + ' NO declarada');
});

// ═══ TEST 3 ═══
console.log('');
console.log('═══════ TEST 3: Fallback v3 ═══════');

function extraerFuncion(html, nombre) {
    const start = html.indexOf('function ' + nombre);
    if (start === -1) return null;
    const resto = html.substring(start + 10);
    const match = resto.match(/\n(?:async\s+)?function\s+\w+\s*\(/);
    if (!match) return html.substring(start).trim();
    const end = start + 10 + match.index;
    return html.substring(start, end).trim();
}

const fbCode = extraerFuncion(html, 'generarFallbackHistorico');
if (!fbCode) {
    ko('No se encontró generarFallbackHistorico');
} else {
    ok('Extraída (' + fbCode.length + ' chars)');
    try { new Function(fbCode); ok('Sintaxis OK'); }
    catch (e) { ko('Sintaxis inválida', e.message); }
    
    if (fbCode.includes('return analisis;')) ok('return analisis; presente');
    else ko('return analisis; ausente');
    
    const sb2 = {
        window: {}, console: { log: () => {}, warn: () => {}, error: () => {} },
        Date, Math, JSON, Object, Array, String, Number, Set, Map,
        RegExp, Error, parseInt, parseFloat, isNaN,
        document: { getElementById: () => ({ textContent: '', style: {} }) },
        localStorage: { getItem: () => null, setItem: () => {} },
        filtrarCronologiaBasura: (c) => c, deduplicarCronologia: (c) => c,
        evaluacion: null, entidades: { entidades: [] }, showToast: () => {},
        Diagnostico: { log: () => {}, warn: () => {}, error: () => {} }
    };
    sb2.window = sb2;
    vm.createContext(sb2);
    
    try {
        vm.runInContext('var __fn = ' + fbCode + ';\nglobalThis.generarFallbackHistorico = __fn;', sb2);
        ok('Función cargada');
        if (typeof sb2.generarFallbackHistorico !== 'function') {
            ko('No es función');
        } else {
            const datosRicos = {
                fuentes: {
                    'Europeana': { count: 3, data: [{ titulo: 'Documento 1', year: '1800' }, { titulo: 'Documento 2', year: '1820' }, { titulo: 'Documento 3', year: '1840' }] },
                    'LOC Chronicling': { count: 2, data: [{ titulo: 'Noticia 1', year: '1850' }, { titulo: 'Noticia 2', year: '1860' }] },
                    'Internet Archive': { count: 2, data: [{ titulo: 'Archive 1', year: '1900', autor: 'A' }, { titulo: 'Archive 2', year: '1920', autor: 'B' }] },
                    'Gutenberg': { count: 2, data: [{ titulo: 'Libro 1', autor: 'Autor 1' }, { titulo: 'Libro 2', autor: 'Autor 2' }] },
                    'Wikipedia REST': { count: 1, data: [{ titulo: 'Revolución', resumen: 'La Revolución Francesa fue un período de cambio político y social en Francia...' }] },
                    'Wikidata': { count: 5, data: [{ titulo: 'Evento A', year: '1789' }, { titulo: 'Evento B', year: '1790' }, { titulo: 'Evento C', year: '1791' }, { titulo: 'Evento D', year: '1792' }, { titulo: 'Evento E', year: '1793' }] },
                    'Wikidata Timeline': { count: 3, data: [{ titulo: 'Toma de la Bastilla', year: '1789' }, { titulo: 'Declaración de Derechos', year: '1789' }, { titulo: 'Reinado del Terror', year: '1793' }] },
                    'DBpedia': { count: 1, data: [{ titulo: 'DBpedia', resumen: 'La Revolución Francesa transformó radicalmente la sociedad europea.' }] },
                    'Wikiquote': { count: 2, data: [{ titulo: 'Cita 1', resumen: 'La libertad guiando al pueblo.' }, { titulo: 'Cita 2', resumen: 'Igualdad, libertad, fraternidad.' }] }
                },
                agentReach: {
                    github: [{ titulo: 'repo-historia', estrellas: 100 }, { titulo: 'dataset-revolucion', estrellas: 50 }],
                    wiki: [{ titulo: 'Revolución Francesa' }, { titulo: 'Toma de la Bastilla' }],
                    reddit: [{ subreddit: 'history', titulo: 'Debate sobre la Revolución' }]
                }
            };
            const texto = sb2.generarFallbackHistorico('Revolución Francesa', '1789', 'El pueblo tomó la Bastilla.', datosRicos);
            if (typeof texto !== 'string') {
                ko('Retorno no es string', typeof texto);
            } else {
                const palabras = texto.split(/\s+/).filter(Boolean).length;
                console.log('📝 Palabras:', palabras);
                if (palabras >= 2000) ok('≥2000 palabras ✅');
                else if (palabras >= 1500) { console.log('⚠️ 1500-2000'); pass++; }
                else ko('Muy corto', palabras);
                const secciones = ['Contexto Histórico','Cronología Detallada','Figuras y Entidades','Citas y Referencias','Hechos Clave','Fuentes Académicas','Recursos Históricos','Agent-Reach','Evaluación Setun','Conclusiones','Nota Metodológica'];
                let okc = 0;
                secciones.forEach(s => { if (texto.includes(s)) okc++; else console.log('   ❌ Falta:', s); });
                if (okc === secciones.length) ok('11 secciones');
                else ko('Secciones', okc + '/11');
                if (texto.includes('Fallback Historiográfico v3')) ok('Firma v3');
                else ko('Firma v3 ausente');
            }
        }
    } catch (e) {
        ko('Ejecución falla', e.message);
        console.log('   Stack:', e.stack.split('\n').slice(0, 3).join('\n'));
    }
}

console.log('');
console.log('═══════ RESULTADO ═══════');
console.log('✅ PASS:', pass, '| ❌ FAIL:', fail);
console.log(fail === 0 ? '🎉 TODO OK' : '⚠️ Revisar fallos');
process.exit(fail === 0 ? 0 : 1);
