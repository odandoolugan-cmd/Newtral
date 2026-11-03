// ═══════════════════════════════════════
// 📊 BENCHMARK SETUN — JS puro vs arrays tipados
// ═══════════════════════════════════════

const fs = require('fs');
const vm = require('vm');

// Cargar setun_core.js
const sb = { window:{}, localStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}}, console:{log:()=>{},warn:()=>{},error:()=>{}}, Date, Math, JSON, Object, Array, String, Number };
sb.window = sb;
vm.createContext(sb);
vm.runInContext(fs.readFileSync('setun_core.js', 'utf8'), sb);
const SC = sb.SetunCore;

// Función para generar N parámetros
function generarParametros(n) {
    const params = {};
    for (let i = 0; i < n; i++) {
        params['param_' + i] = {
            valor: Math.random() * 10,
            ternario: Math.floor(Math.random() * 3) - 1,  // -1, 0, 1
            peso: 1 / n
        };
    }
    return params;
}

// Benchmark con objeto plano
function benchObjeto(n, iteraciones = 100) {
    const params = generarParametros(n);
    const claves = Object.keys(params);
    
    const inicio = performance.now();
    for (let it = 0; it < iteraciones; it++) {
        let suma = 0;
        for (let i = 0; i < claves.length; i++) {
            const p = params[claves[i]];
            suma += p.ternario * p.peso;
        }
        // resultado ternario
        const _ = suma > 0.25 ? 1 : (suma < -0.25 ? -1 : 0);
    }
    const fin = performance.now();
    return (fin - inicio) / iteraciones;
}

// Benchmark con arrays tipados
function benchArray(n, iteraciones = 100) {
    const ternarios = new Int8Array(n);
    const pesos = new Float32Array(n);
    for (let i = 0; i < n; i++) {
        ternarios[i] = Math.floor(Math.random() * 3) - 1;
        pesos[i] = 1 / n;
    }
    
    const inicio = performance.now();
    for (let it = 0; it < iteraciones; it++) {
        let suma = 0;
        for (let i = 0; i < n; i++) {
            suma += ternarios[i] * pesos[i];
        }
        const _ = suma > 0.25 ? 1 : (suma < -0.25 ? -1 : 0);
    }
    const fin = performance.now();
    return (fin - inicio) / iteraciones;
}

// Ejecutar benchmarks
console.log('═══════════════════════════════════════');
console.log('📊 BENCHMARK SETUN — JS puro vs tipado');
console.log('═══════════════════════════════════════');
console.log('');
console.log('N'.padStart(8), '|', 'Objeto'.padStart(12), '|', 'Tipado'.padStart(12), '|', 'Speedup'.padStart(10));
console.log('─'.repeat(60));

[30, 100, 1000, 10000, 100000, 1000000].forEach(n => {
    const tObj = benchObjeto(n, 10);
    const tArr = benchArray(n, 10);
    const speedup = (tObj / tArr).toFixed(1) + 'x';
    console.log(
        String(n).padStart(8), '|',
        (tObj.toFixed(3) + 'ms').padStart(12), '|',
        (tArr.toFixed(3) + 'ms').padStart(12), '|',
        speedup.padStart(10)
    );
});

console.log('');
console.log('═══════════════════════════════════════');
console.log('✅ Benchmark completado');
