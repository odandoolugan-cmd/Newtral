const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

const originalStart = "async function extraerDeWikipedia(titulo) {";
if (html.indexOf(originalStart) === -1) {
    console.log("❌ No se encontró extraerDeWikipedia");
    process.exit(1);
}

const startIdx = html.indexOf(originalStart);
const endMarker = "async function extraerDeAtlasPI";
const endIdx = html.indexOf(endMarker, startIdx);

if (endIdx === -1) {
    console.log("❌ No se encontró el fin de extraerDeWikipedia");
    process.exit(1);
}

const newBlock = [
'async function extraerDeWikipedia(titulo) {',
'    // FIX: Usar API extracts (texto completo) con fallback a summary',
'    try {',
'        // 1. Intentar con extracts (texto completo del articulo)',
'        const urlExtracts = "https://es.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&format=json&origin=*&titles=" + encodeURIComponent(titulo);',
'        const respExtracts = await fetch(urlExtracts);',
'        const dataExtracts = await respExtracts.json();',
'',
'        if (dataExtracts.query && dataExtracts.query.pages) {',
'            const pages = dataExtracts.query.pages;',
'            const pageId = Object.keys(pages)[0];',
'            const page = pages[pageId];',
'            if (page && page.extract && page.extract.length > 100) {',
'                console.log("OK Wikipedia (extracts):", page.title, "·", page.extract.length, "chars");',
'                return {',
'                    titulo: page.title,',
'                    resumen: page.extract,',
'                    url: "https://es.wikipedia.org/wiki/" + encodeURIComponent(page.title)',
'                };',
'            }',
'        }',
'',
'        // 2. Fallback: summary (resumen corto)',
'        const urlSummary = "https://es.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(titulo);',
'        const respSummary = await fetch(urlSummary, {',
'            headers: { "Api-User-Agent": "Newtral/1.0" }',
'        });',
'        if (respSummary.ok) {',
'            const dataSummary = await respSummary.json();',
'            if (dataSummary.extract && dataSummary.extract.length > 50) {',
'                console.log("OK Wikipedia (summary):", dataSummary.title, "·", dataSummary.extract.length, "chars");',
'                return {',
'                    titulo: dataSummary.title,',
'                    resumen: dataSummary.extract,',
'                    url: dataSummary.content_urls?.desktop?.page',
'                };',
'            }',
'        }',
'',
'        // 3. Fallback: opensearch + extracts',
'        const searchUrl = "https://es.wikipedia.org/w/api.php?action=opensearch&search=" + encodeURIComponent(titulo) + "&limit=1&format=json&origin=*";',
'        const searchResp = await fetch(searchUrl);',
'        const searchData = await searchResp.json();',
'        if (searchData[1] && searchData[1].length > 0) {',
'            const mejorTitulo = searchData[1][0];',
'            console.log("OK Wikipedia (busqueda):", mejorTitulo);',
'            const url2 = "https://es.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&format=json&origin=*&titles=" + encodeURIComponent(mejorTitulo);',
'            const resp2 = await fetch(url2);',
'            const data2 = await resp2.json();',
'            if (data2.query && data2.query.pages) {',
'                const p = data2.query.pages[Object.keys(data2.query.pages)[0]];',
'                if (p && p.extract) {',
'                    return {',
'                        titulo: p.title,',
'                        resumen: p.extract,',
'                        url: "https://es.wikipedia.org/wiki/" + encodeURIComponent(p.title)',
'                    };',
'                }',
'            }',
'        }',
'',
'        return null;',
'    } catch(e) {',
'        console.warn("WARN Wikipedia falla:", e.message);',
'        return null;',
'    }',
'}',
'',
''].join('\n');

html = html.substring(0, startIdx) + newBlock + html.substring(endIdx);
fs.writeFileSync("index.html", html);
console.log("OK extraerDeWikipedia actualizado (extracts + fallback summary)");
