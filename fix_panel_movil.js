const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

if (html.indexOf("debugPanelClose") !== -1) {
    console.log("⚠️ Fix panel móvil ya existe");
    process.exit(0);
}

// Buscar el div del debugPanel
const oldPanel = `<div id="debugPanel" style="position:fixed;bottom:0;left:0;right:0;max-height:250px;overflow-y:auto;background:#000;color:#0f0;font-family:monospace;font-size:10px;padding:8px;z-index:99999;display:none;"></div>`;

if (html.indexOf(oldPanel) === -1) {
    console.log("❌ No se encontró el debugPanel original");
    // Buscar aproximación
    const idx = html.indexOf("id=\"debugPanel\"");
    if (idx !== -1) {
        console.log("Contexto:", JSON.stringify(html.substring(idx - 100, idx + 300)));
    }
    process.exit(1);
}

const newPanel = `<!-- Panel de debug responsive (móvil-friendly) -->
<div id="debugPanel" style="position:fixed;bottom:0;left:0;right:0;height:25vh;max-height:200px;overflow-y:auto;background:rgba(0,0,0,0.95);color:#0f0;font-family:monospace;font-size:9px;padding:6px;z-index:99999;display:none;border-top:2px solid #8b5cf6;border-radius:8px 8px 0 0;">
    <div style="position:sticky;top:0;background:#1a1a2e;padding:4px;margin:-6px -6px 4px -6px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #8b5cf6;">
        <span style="color:#8b5cf6;font-weight:bold;font-size:10px;">🔍 Debug</span>
        <button id="debugPanelClose" onclick="document.getElementById('debugPanel').style.display='none'; document.getElementById('debugToggle').textContent='🔍 Debug';" style="background:#f00;color:#fff;border:none;border-radius:4px;padding:2px 8px;font-size:12px;cursor:pointer;font-weight:bold;">✕</button>
    </div>
    <div id="debugPanelContent"></div>
</div>`;

html = html.replace(oldPanel, newPanel);

// Actualizar el botón toggle
const oldToggle = `<button id="debugToggle" style="position:fixed;bottom:260px;right:10px;z-index:100000;background:#8b5cf6;color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:11px;cursor:pointer;">🔍 Debug</button>`;

if (html.indexOf(oldToggle) !== -1) {
    const newToggle = `<button id="debugToggle" style="position:fixed;bottom:calc(25vh + 10px);right:8px;z-index:100000;background:#8b5cf6;color:#fff;border:none;padding:6px 10px;border-radius:20px;font-size:11px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.5);">🔍 Debug</button>`;
    html = html.replace(oldToggle, newToggle);
}

// Actualizar el toggle onclick para usar el nuevo content
const oldToggleJS = `    toggle.onclick = () => {
        visible = !visible;
        panel.style.display = visible ? "block" : "none";
    };`;

const newToggleJS = `    toggle.onclick = () => {
        const isVisible = panel.style.display === "block";
        panel.style.display = isVisible ? "none" : "block";
        toggle.textContent = isVisible ? "🔍 Debug" : "❌ Cerrar";
    };`;

if (html.indexOf(oldToggleJS) !== -1) {
    html = html.replace(oldToggleJS, newToggleJS);
}

// Actualizar la función addLine para usar #debugPanelContent
const oldAddLine = `    const originalLog = console.log;
    console.log = function(...args) {
        originalLog.apply(console, args);
        if (panel) {
            panel.innerHTML += args.join(" ") + "<br>";
            panel.scrollTop = panel.scrollHeight;
        }
    };`;

const newAddLine = `    const content = document.getElementById("debugPanelContent");
    const originalLog = console.log;
    console.log = function(...args) {
        originalLog.apply(console, args);
        if (content) {
            content.innerHTML += args.join(" ") + "<br>";
            content.scrollTop = content.scrollHeight;
        }
    };`;

if (html.indexOf(oldAddLine) !== -1) {
    html = html.replace(oldAddLine, newAddLine);
}

fs.writeFileSync("index.html", html);
console.log("✅ Panel de debug responsive instalado");
