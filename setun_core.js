// 🧬 Núcleo Setun 1958 v3.2 — Lógica Ternaria Historiográfica
// 30 parámetros · Datos ausentes → neutro · Pesos normalizados a 1.0

window.SetunCore = {
    version: '3.2-historia',
    historial: [],

    ternario: function(valor, umbralBajo, umbralAlto) {
        if (valor === null || valor === undefined || isNaN(valor)) return 0;  // sin dato → neutro
        if (valor <= umbralBajo) return -1;
        if (valor >= umbralAlto) return 1;
        return 0;
    },

    filtroAnalogico: function(señales) {
        if (!señales || señales.length === 0) return 0;
        const suma = señales.reduce((acc, v) => acc + v, 0);
        if (suma > 0.25) return 1;
        if (suma < -0.25) return -1;
        return 0;
    },

    evaluarParametros: function(datos) {
        const p = {};
        const add = (key, valor, umbralBajo, umbralAlto, peso, nombre) => {
            p[key] = {
                valor: valor === undefined ? '—' : valor,
                ternario: this.ternario(valor, umbralBajo, umbralAlto),
                peso: peso,
                nombre: nombre
            };
        };

        // ─── BLOQUE 1: FUENTES (8 params) ───
        add('fuentesActivas', datos.fuentesActivas, 2, 8, 0.04, 'Fuentes activas');
        add('totalReferencias', datos.totalReferencias, 5, 20, 0.04, 'Total referencias');
        add('fuentesAcademicas', datos.fuentesAcademicas, 1, 4, 0.035, 'Fuentes académicas');
        add('fuentesHistoricas', datos.fuentesHistoricas, 1, 3, 0.035, 'Fuentes históricas');
        add('consistencia',
            datos.fuentesActivas && datos.fuentesExitosas !== undefined
                ? (datos.fuentesExitosas / datos.fuentesActivas) * 100
                : undefined,
            40, 70, 0.03, 'Consistencia (%)');
        add('diversidadFuentes', datos.diversidadFuentes, 2, 6, 0.03, 'Diversidad fuentes');
        add('fuentesRecientes', datos.fuentesRecientes, 1, 5, 0.03, 'Recencia XX-XXI');
        add('fuentesPrimarias', datos.fuentesPrimarias, 1, 4, 0.025, 'Fuentes primarias');

        // ─── BLOQUE 2: CRONOLOGÍA (5 params) ───
        add('eventosCronologia', datos.eventosCronologia, 1, 5, 0.04, 'Eventos cronología');
        add('rangoTemporal', datos.rangoTemporal, 50, 200, 0.04, 'Rango temporal (años)');
        add('densidadTemporal', datos.densidadTemporal, 0.5, 2, 0.04, 'Densidad temporal');
        add('coherenciaFechas', datos.coherenciaFechas, 30, 70, 0.04, 'Coherencia fechas (%)');
        add('contextoGeopolitico', datos.contextoGeopolitico, 1, 4, 0.03, 'Contexto geopolítico');

        // ─── BLOQUE 3: ENTIDADES (3 params) ───
        add('entidades', datos.entidades, 1, 5, 0.05, 'Entidades históricas');
        add('personajes', datos.personajes, 1, 4, 0.05, 'Personajes clave');
        add('lugares', datos.lugares, 1, 3, 0.05, 'Lugares históricos');

        // ─── BLOQUE 4: CONTENIDO (3 params) ───
        add('palabras', datos.palabras, 300, 1000, 0.05, 'Palabras totales');
        add('citas', datos.citas, 1, 4, 0.05, 'Citas textuales');
        add('densidadRefs',
            datos.totalReferencias !== undefined && datos.palabras
                ? (datos.totalReferencias / datos.palabras) * 100
                : undefined,
            0.5, 3, 0.05, 'Densidad refs (%)');

        // ─── BLOQUE 5: CALIDAD (6 params) ───
        const tonoMap = { 'Optimista': 1, 'Equilibrado': 0, 'Crítico': -1 };
        const tonoValor = datos.tono !== undefined && tonoMap[datos.tono] !== undefined ? tonoMap[datos.tono] : undefined;
        
        p.tono = {
            valor: datos.tono || '—',
            ternario: tonoValor === undefined ? 0 : tonoValor,
            peso: 0.035,
            nombre: 'Tono histórico'
        };
        
        add('agentReach', datos.agentReach, 1, 5, 0.035, 'Agent-Reach (vivos)');
        add('seccionesCompletas', datos.seccionesCompletas, 2, 3, 0.035, 'Secciones completas');
        add('profundidad', datos.palabras ? datos.palabras / 100 : undefined, 5, 15, 0.035, 'Profundidad (x100 palabras)');
        add('riquezaVocabulario', datos.riquezaVocabulario, 30, 60, 0.035, 'Riqueza vocab (%)');
        
        p.balanceTonal = {
            valor: tonoValor === undefined ? '—' : (tonoValor === 0 ? 1 : 0),
            ternario: tonoValor === undefined ? 0 : (tonoValor === 0 ? 1 : 0),
            peso: 0.025,
            nombre: 'Balance tonal'
        };

        // ─── BLOQUE 6: META (5 params) ───
        add('idioma',
            datos.idioma !== undefined ? (datos.idioma === 'es' ? 1 : 0) : undefined,
            -0.5, 0.5, 0.03, 'Idioma correcto');
        add('tiempoLectura', datos.tiempoLectura, 3, 10, 0.03, 'Tiempo lectura (min)');
        add('legibilidad', datos.legibilidad, 30, 60, 0.03, 'Legibilidad score');
        add('relevancia', datos.relevancia, 50, 80, 0.03, 'Índice relevancia (%)');
        add('citasBienFormadas', datos.citasBienFormadas, 0, 3, 0.03, 'Citas bien formadas');

        // ─── Normalizar pesos a 1.0 ───
        const totalPeso = Object.values(p).reduce((s, x) => s + x.peso, 0);
        Object.values(p).forEach(x => { x.peso = +(x.peso / totalPeso).toFixed(4); });

        return p;
    },

    generarParametros: function(n) {
        // Genera N parámetros desde 10 bloques temáticos
        const bloques = [
            'Fuentes', 'Cronología', 'Entidades', 'Contenido', 'Calidad',
            'Meta', 'Geopolítica', 'Economía', 'Cultura', 'Sociedad'
        ];
        const params = {};
        const pesoBase = 1 / n;
        
        for (let i = 0; i < n; i++) {
            const bloque = bloques[i % bloques.length];
            const nombre = bloque + '_param_' + i;
            params[nombre] = {
                valor: 0,
                ternario: 0,
                peso: pesoBase,
                nombre: nombre,
                bloque: bloque
            };
        }
        
        return params;
    },


    evaluarAnalisisMasivo: function(datos, n) {
        // ═══ MODO MASIVO: N > 1000 params sin crear objetos ═══
        // Usa Int8Array + Float32Array directamente (5 bytes por param)
        // 1M params = 5MB (vs 100MB con objetos)
        
        const ternarios = new Int8Array(n);
        const pesos = new Float32Array(n);
        const pesoBase = 1 / n;
        
        // Rellenar datos (solo los primeros 30 relevantes)
        const datosClaves = Object.keys(datos);
        const maxDatos = Math.min(datosClaves.length, 30);
        let datosPresentes = 0;
        
        for (let i = 0; i < maxDatos; i++) {
            const clave = datosClaves[i];
            const valor = datos[clave];
            if (valor !== undefined && valor !== null) {
                ternarios[i] = this.ternario(valor, 0, 1);
                datosPresentes++;
            }
        }
        
        // Pesos (todos iguales en modo masivo)
        for (let i = 0; i < n; i++) pesos[i] = pesoBase;
        
        // Suma (1 sola pasada)
        let suma = 0;
        for (let i = 0; i < n; i++) suma += ternarios[i] * pesos[i];
        
        // Contadores (1 sola pasada)
        let pos = 0, neg = 0, neu = 0;
        for (let i = 0; i < n; i++) {
            const t = ternarios[i];
            if (t === 1) pos++;
            else if (t === -1) neg++;
            else neu++;
        }
        
        const resultado = suma > 0.25 ? 1 : (suma < -0.25 ? -1 : 0);
        
        let estado, color, icono, mensaje, nivelConfianza;
        if (resultado === 1) {
            estado = 'POSITIVO (+1)'; color = '#10b981'; icono = '✅';
            mensaje = 'Análisis masivo con ' + n.toLocaleString() + ' parámetros. ' + pos + ' positivos detectados.';
            nivelConfianza = 'ALTA';
        } else if (resultado === -1) {
            estado = 'NEGATIVO (-1)'; color = '#ef4444'; icono = '⚠️';
            mensaje = 'Análisis masivo con ' + n.toLocaleString() + ' parámetros. ' + neg + ' negativos detectados.';
            nivelConfianza = 'BAJA';
        } else {
            estado = 'NEUTRO (0)'; color = '#f59e0b'; icono = '⚖️';
            mensaje = 'Análisis masivo con ' + n.toLocaleString() + ' parámetros. ' + neu + ' neutros (sin datos).';
            nivelConfianza = 'MEDIA';
        }
        
        return {
            version: this.version,
            valorTernario: resultado,
            estado, color, icono, mensaje, nivelConfianza,
            completitud: Math.round((datosPresentes / Math.min(maxDatos, n)) * 100),
            parametros: [],  // sin detalle (muy grande)
            sumaPositiva: pos,
            sumaNegativa: neg,
            sumaNeutra: neu,
            totalParametros: n,
            modo: 'masivo',
            timestamp: new Date().toISOString()
        };
    },

    evaluarAnalisisMasivo: function(datos, n) {
        // Modo masivo: N > 1000 params sin crear objetos
        const ternarios = new Int8Array(n);
        const pesos = new Float32Array(n);
        const pesoBase = 1 / n;
        
        const datosClaves = Object.keys(datos);
        const maxDatos = Math.min(datosClaves.length, 30);
        let datosPresentes = 0;
        
        for (let i = 0; i < maxDatos; i++) {
            const clave = datosClaves[i];
            const valor = datos[clave];
            if (valor !== undefined && valor !== null) {
                ternarios[i] = this.ternario(valor, 0, 1);
                datosPresentes++;
            }
        }
        
        for (let i = 0; i < n; i++) pesos[i] = pesoBase;
        
        let suma = 0;
        for (let i = 0; i < n; i++) suma += ternarios[i] * pesos[i];
        
        let pos = 0, neg = 0, neu = 0;
        for (let i = 0; i < n; i++) {
            const t = ternarios[i];
            if (t === 1) pos++;
            else if (t === -1) neg++;
            else neu++;
        }
        
        const resultado = suma > 0.25 ? 1 : (suma < -0.25 ? -1 : 0);
        
        let estado, color, icono, mensaje, nivelConfianza;
        if (resultado === 1) {
            estado = 'POSITIVO (+1)'; color = '#10b981'; icono = '✅';
            mensaje = 'Análisis masivo con ' + n.toLocaleString() + ' parámetros. ' + pos + ' positivos detectados.';
            nivelConfianza = 'ALTA';
        } else if (resultado === -1) {
            estado = 'NEGATIVO (-1)'; color = '#ef4444'; icono = '⚠️';
            mensaje = 'Análisis masivo con ' + n.toLocaleString() + ' parámetros. ' + neg + ' negativos detectados.';
            nivelConfianza = 'BAJA';
        } else {
            estado = 'NEUTRO (0)'; color = '#f59e0b'; icono = '⚖️';
            mensaje = 'Análisis masivo con ' + n.toLocaleString() + ' parámetros. ' + neu + ' neutros (sin datos).';
            nivelConfianza = 'MEDIA';
        }
        
        return {
            version: this.version,
            valorTernario: resultado,
            estado, color, icono, mensaje, nivelConfianza,
            completitud: Math.round((datosPresentes / Math.min(maxDatos, n)) * 100),
            parametros: [],
            sumaPositiva: pos,
            sumaNegativa: neg,
            sumaNeutra: neu,
            totalParametros: n,
            modo: 'masivo',
            timestamp: new Date().toISOString()
        };
    },

    evaluarAnalisis: function(datos, n) {
        // ═══ MODO MASIVO: N > 1000 usa arrays tipados sin objetos ═══
        if (n && n > 1000) {
            return this.evaluarAnalisisMasivo(datos, n);
        }
        
        let parametros;
        
        // Modo extendido: N parámetros (generados)
        if (n && n > 30) {
            parametros = this.generarParametros(n);
            Object.keys(parametros).forEach(key => {
                const valor = datos[key];
                if (valor !== undefined && valor !== null) {
                    parametros[key].valor = valor;
                    parametros[key].ternario = this.ternario(valor, 0, 1);
                }
            });
        } else {
            // Modo normal: 30 parámetros (fijos)
            parametros = this.evaluarParametros(datos);
        }
        
        const claves = Object.keys(parametros);
        const nClaves = claves.length;
        
        // ═══ OPTIMIZACIÓN: arrays tipados ═══
        // Int8Array: 1 byte por ternario (-1, 0, 1)
        // Float32Array: 4 bytes por peso
        const ternarios = new Int8Array(nClaves);
        const pesos = new Float32Array(nClaves);
        
        let sumaPesosPresentes = 0;
        
        for (let i = 0; i < nClaves; i++) {
            const p = parametros[claves[i]];
            ternarios[i] = p.ternario;
            pesos[i] = p.peso;
            if (p.valor !== '—') sumaPesosPresentes += p.peso;
        }
        
        // Producto punto (suma de ternario × peso)
        let suma = 0;
        for (let i = 0; i < nClaves; i++) {
            suma += ternarios[i] * pesos[i];
        }
        
        // Filtro analógico
        const resultado = suma > 0.25 ? 1 : (suma < -0.25 ? -1 : 0);
        
        // Contadores (1 sola pasada)
        let positivos = 0, negativos = 0, neutros = 0;
        for (let i = 0; i < nClaves; i++) {
            const t = ternarios[i];
            if (t === 1) positivos++;
            else if (t === -1) negativos++;
            else neutros++;
        }
        
        // Estado y mensaje
        let estado, color, icono, mensaje, nivelConfianza;
        if (resultado === 1) {
            estado = 'POSITIVO (+1)'; color = '#10b981'; icono = '✅';
            mensaje = 'Análisis robusto. ' + nClaves + ' parámetros confirman calidad historiográfica.';
            nivelConfianza = 'ALTA';
        } else if (resultado === -1) {
            estado = 'NEGATIVO (-1)'; color = '#ef4444'; icono = '⚠️';
            mensaje = 'Análisis con reservas. Múltiples parámetros negativos detectados.';
            nivelConfianza = 'BAJA';
        } else {
            estado = 'NEUTRO (0)'; color = '#f59e0b'; icono = '⚖️';
            mensaje = 'Análisis parcial. El estado soviético de incertidumbre: necesita más contexto.';
            nivelConfianza = 'MEDIA';
        }
        
        const completitud = Math.round(sumaPesosPresentes * 100);
        
        // Detalle (objeto, para compatibilidad con UI)
        const detalle = new Array(nClaves);
        for (let i = 0; i < nClaves; i++) {
            const p = parametros[claves[i]];
            detalle[i] = {
                clave: claves[i],
                nombre: p.nombre,
                valor: p.valor,
                ternario: p.ternario,
                peso: p.peso,
                contribucion: (p.ternario * p.peso).toFixed(4)
            };
        }
        
        const evaluacion = {
            version: this.version,
            valorTernario: resultado,
            estado, color, icono, mensaje, nivelConfianza, completitud,
            parametros: detalle,
            sumaPositiva: positivos, sumaNegativa: negativos, sumaNeutra: neutros,
            totalParametros: nClaves,
            timestamp: new Date().toISOString()
        };
        
        this.historial.push(evaluacion);
        if (this.historial.length > 50) this.historial.shift();
        // Persistir historial completo solo cada 50 análisis (contador independiente)
        this._contadorAnalisis = (this._contadorAnalisis || 0) + 1;
        if (this._contadorAnalisis % 50 === 0) {
            try { localStorage.setItem('setun_historial', JSON.stringify(this.historial)); } catch(e) {}
        }
        return evaluacion;
    },
    
    generarBloqueVisual: function(e) {
        let filas = '';
        e.parametros.forEach(p => {
            const c = p.ternario === 1 ? '#10b981' : (p.ternario === -1 ? '#ef4444' : '#f59e0b');
            const f = p.ternario === 1 ? '▲' : (p.ternario === -1 ? '▼' : '●');
            filas += '<tr><td style="padding:2px 4px;color:#aaa;font-size:10px;">' + p.nombre + '</td><td style="text-align:center;color:#ccc;font-size:10px;">' + p.valor + '</td><td style="text-align:center;color:' + c + ';font-weight:bold;font-size:10px;">' + f + ' ' + p.ternario + '</td><td style="text-align:center;color:#666;font-size:9px;">' + p.peso + '</td></tr>';
        });
        return '<div style="margin:15px 0;padding:12px;border-radius:10px;background:rgba(0,0,0,0.4);border:2px solid ' + e.color + ';">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
            '<div><span style="font-size:11px;color:#8b5cf6;font-weight:bold;">🧬 SETUN 1958 v' + e.version + '</span><span style="font-size:9px;color:#666;margin-left:8px;">' + e.totalParametros + ' parámetros ternarios</span></div>' +
            '<div style="font-size:16px;font-weight:bold;color:' + e.color + ';">' + e.icono + ' ' + e.estado + '</div></div>' +
            '<div style="font-size:11px;color:#ccc;margin-bottom:8px;">' + e.mensaje + '</div>' +
            '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px;">' +
            '<div style="text-align:center;padding:4px;background:rgba(16,185,129,0.15);border-radius:4px;"><div style="font-size:14px;color:#10b981;font-weight:bold;">' + e.sumaPositiva + '</div><div style="font-size:8px;color:#888;">Positivos</div></div>' +
            '<div style="text-align:center;padding:4px;background:rgba(245,158,11,0.15);border-radius:4px;"><div style="font-size:14px;color:#f59e0b;font-weight:bold;">' + e.sumaNeutra + '</div><div style="font-size:8px;color:#888;">Neutros</div></div>' +
            '<div style="text-align:center;padding:4px;background:rgba(239,68,68,0.15);border-radius:4px;"><div style="font-size:14px;color:#ef4444;font-weight:bold;">' + e.sumaNegativa + '</div><div style="font-size:8px;color:#888;">Negativos</div></div>' +
            '<div style="text-align:center;padding:4px;background:rgba(139,92,246,0.15);border-radius:4px;"><div style="font-size:14px;color:#8b5cf6;font-weight:bold;">' + e.completitud + '%</div><div style="font-size:8px;color:#888;">Completitud</div></div></div>' +
            '<details><summary style="font-size:10px;color:#8b5cf6;cursor:pointer;font-weight:bold;">🔍 Ver los ' + e.totalParametros + ' parámetros ternarios</summary>' +
            '<table style="width:100%;margin-top:6px;border-collapse:collapse;"><thead><tr style="font-size:9px;color:#666;border-bottom:1px solid #333;"><th style="text-align:left;padding:2px 4px;">Parámetro</th><th style="text-align:center;">Valor</th><th style="text-align:center;">Estado</th><th style="text-align:center;">Peso</th></tr></thead><tbody>' + filas + '</tbody></table></details>' +
            '<div style="font-size:8px;color:#555;margin-top:6px;text-align:center;">🕰️ ' + new Date(e.timestamp).toLocaleString('es-ES') + '</div></div>';
    },

    getEstadisticas: function() {
        if (this.historial.length === 0) return { total: 0, positivos: 0, negativos: 0, neutros: 0, porcentajePositivo: 0, porcentajeNeutro: 0, porcentajeNegativo: 0, completitudPromedio: 0 };
        const t = this.historial.length;
        const pos = this.historial.filter(e => e.valorTernario === 1).length;
        const neg = this.historial.filter(e => e.valorTernario === -1).length;
        const neu = this.historial.filter(e => e.valorTernario === 0).length;
        return {
            total: t, positivos: pos, negativos: neg, neutros: neu,
            porcentajePositivo: Math.round((pos / t) * 100),
            porcentajeNeutro: Math.round((neu / t) * 100),
            porcentajeNegativo: Math.round((neg / t) * 100),
            completitudPromedio: Math.round(this.historial.reduce((a, e) => a + e.completitud, 0) / t)
        };
    },

    cargarHistorial: function() {
        try {
            const s = localStorage.getItem('setun_historial');
            if (s) this.historial = JSON.parse(s);
        } catch(e) { this.historial = []; }
    }
};

window.SetunCore.cargarHistorial();
console.log('🧬 Setun Core v' + window.SetunCore.version + ' — 30 parámetros ternarios cargados.');
