// 🧬 Núcleo Setun 1958 v2 — Lógica Ternaria Historiográfica
// Adaptado para Newtral: evalúa calidad de análisis histórico

window.SetunCore = {
    version: '2.0-historia',
    historial: [],

    // ─────────────────────────────────────
    // 1. FUNCIÓN TERNARIA BASE
    // ─────────────────────────────────────
    ternario: function(valor, umbralBajo, umbralAlto) {
        if (valor === null || valor === undefined) return 0;
        if (valor <= umbralBajo) return -1;
        if (valor >= umbralAlto) return 1;
        return 0;
    },

    // ─────────────────────────────────────
    // 2. FILTRO ANALÓGICO
    // ─────────────────────────────────────
    filtroAnalogico: function(señales) {
        if (!señales || señales.length === 0) return 0;
        const suma = señales.reduce((acc, v) => acc + v, 0);
        const promedio = suma / señales.length;
        if (promedio > 0.30) return 1;
        if (promedio < -0.30) return -1;
        return 0;
    },

    // ─────────────────────────────────────
    // 3. EVALUACIÓN DE LOS 10 PARÁMETROS
    // ─────────────────────────────────────
    evaluarParametros: function(datos) {
        const params = {};

        params.fuentesActivas = {
            valor: datos.fuentesActivas || 0,
            ternario: this.ternario(datos.fuentesActivas || 0, 2, 10),
            peso: 0.15,
            nombre: 'Fuentes activas'
        };

        params.eventosCronologia = {
            valor: datos.eventosCronologia || 0,
            ternario: this.ternario(datos.eventosCronologia || 0, 0, 5),
            peso: 0.12,
            nombre: 'Eventos cronología'
        };

        params.entidades = {
            valor: datos.entidades || 0,
            ternario: this.ternario(datos.entidades || 0, 0, 3),
            peso: 0.10,
            nombre: 'Entidades históricas'
        };

        params.citas = {
            valor: datos.citas || 0,
            ternario: this.ternario(datos.citas || 0, 0, 3),
            peso: 0.10,
            nombre: 'Citas textuales'
        };

        params.rangoTemporal = {
            valor: datos.rangoTemporal || 0,
            ternario: this.ternario(datos.rangoTemporal || 0, 50, 100),
            peso: 0.10,
            nombre: 'Rango temporal (años)'
        };

        const densidad = (datos.totalReferencias || 0) / Math.max(1, datos.palabras || 1000) * 100;
        params.densidadRefs = {
            valor: densidad.toFixed(2),
            ternario: this.ternario(densidad, 0.5, 3),
            peso: 0.10,
            nombre: 'Densidad referencias (%)'
        };

        const tonoMap = { 'Optimista': 1, 'Equilibrado': 0, 'Crítico': -1 };
        params.tono = {
            valor: datos.tono || 'Equilibrado',
            ternario: tonoMap[datos.tono] !== undefined ? tonoMap[datos.tono] : 0,
            peso: 0.08,
            nombre: 'Tono histórico'
        };

        params.agentReach = {
            valor: datos.agentReach || 0,
            ternario: this.ternario(datos.agentReach || 0, 0, 5),
            peso: 0.08,
            nombre: 'Agent-Reach (vivos)'
        };

        const consistencia = (datos.fuentesExitosas || 0) / Math.max(1, datos.fuentesActivas || 20) * 100;
        params.consistencia = {
            valor: consistencia.toFixed(0) + '%',
            ternario: this.ternario(consistencia, 40, 70),
            peso: 0.09,
            nombre: 'Consistencia fuentes (%)'
        };

        params.recencia = {
            valor: datos.fuentesRecientes || 0,
            ternario: this.ternario(datos.fuentesRecientes || 0, 0, 3),
            peso: 0.08,
            nombre: 'Recencia (XX-XXI)'
        };

        return params;
    },

    // ─────────────────────────────────────
    // 4. INFERENCIA TERNARIA COMPLETA
    // ─────────────────────────────────────
    evaluarAnalisis: function(datos) {
        const parametros = this.evaluarParametros(datos);
        const señalesPonderadas = [];
        const detalleParametros = [];

        Object.entries(parametros).forEach(([key, p]) => {
            señalesPonderadas.push(p.ternario * p.peso);
            detalleParametros.push({
                clave: key,
                nombre: p.nombre,
                valor: p.valor,
                ternario: p.ternario,
                peso: p.peso,
                contribucion: (p.ternario * p.peso).toFixed(3)
            });
        });

        const resultadoFiltrado = this.filtroAnalogico(señalesPonderadas);

        let estado, color, icono, mensaje, nivelConfianza;

        if (resultadoFiltrado === 1) {
            estado = 'POSITIVO (+1)';
            color = '#10b981';
            icono = '✅';
            mensaje = 'Análisis robusto. Fuentes abundantes, cronología clara y datos consistentes.';
            nivelConfianza = 'ALTA';
        } else if (resultadoFiltrado === -1) {
            estado = 'NEGATIVO (-1)';
            color = '#ef4444';
            icono = '⚠️';
            mensaje = 'Análisis con reservas. Datos escasos o contradictorios. Requiere más investigación.';
            nivelConfianza = 'BAJA';
        } else {
            estado = 'NEUTRO (0)';
            color = '#f59e0b';
            icono = '⚖️';
            mensaje = 'Análisis parcial. El estado soviético de incertidumbre: necesita más contexto.';
            nivelConfianza = 'MEDIA';
        }

        const sumaPositiva = detalleParametros.filter(p => p.ternario === 1).length;
        const sumaNegativa = detalleParametros.filter(p => p.ternario === -1).length;
        const completitud = Math.min(100, Math.round((sumaPositiva / 10) * 100) + 30);

        const evaluacion = {
            version: this.version,
            valorTernario: resultadoFiltrado,
            estado: estado,
            color: color,
            icono: icono,
            mensaje: mensaje,
            nivelConfianza: nivelConfianza,
            completitud: completitud,
            parametros: detalleParametros,
            sumaPositiva: sumaPositiva,
            sumaNegativa: sumaNegativa,
            sumaNeutra: 10 - sumaPositiva - sumaNegativa,
            timestamp: new Date().toISOString()
        };

        this.historial.push(evaluacion);
        if (this.historial.length > 50) this.historial.shift();

        try {
            localStorage.setItem('setun_historial', JSON.stringify(this.historial));
        } catch(e) {}

        return evaluacion;
    },

    // ─────────────────────────────────────
    // 5. BLOQUE VISUAL HTML
    // ─────────────────────────────────────
    generarBloqueVisual: function(evaluacion) {
        let tablaParametros = '';
        evaluacion.parametros.forEach(p => {
            const color = p.ternario === 1 ? '#10b981' : (p.ternario === -1 ? '#ef4444' : '#f59e0b');
            const flecha = p.ternario === 1 ? '▲' : (p.ternario === -1 ? '▼' : '●');
            tablaParametros += '<tr style="font-size: 10px;">' +
                '<td style="padding: 2px 4px; color: #aaa;">' + p.nombre + '</td>' +
                '<td style="padding: 2px 4px; color: #ccc; text-align: center;">' + p.valor + '</td>' +
                '<td style="padding: 2px 4px; color: ' + color + '; text-align: center; font-weight: bold;">' + flecha + ' ' + p.ternario + '</td>' +
                '</tr>';
        });

        return '<div style="margin: 15px 0; padding: 12px; border-radius: 10px; background: rgba(0,0,0,0.4); border: 2px solid ' + evaluacion.color + ';">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
                '<div>' +
                    '<span style="font-size: 11px; color: #8b5cf6; font-weight: bold;">🧬 NÚCLEO SETUN 1958 v' + evaluacion.version + '</span>' +
                    '<span style="font-size: 9px; color: #666; margin-left: 8px;">Lógica Ternaria Historiográfica</span>' +
                '</div>' +
                '<div style="font-size: 16px; font-weight: bold; color: ' + evaluacion.color + ';">' +
                    evaluacion.icono + ' ' + evaluacion.estado +
                '</div>' +
            '</div>' +
            '<div style="font-size: 11px; color: #ccc; margin-bottom: 8px;">' + evaluacion.mensaje + '</div>' +
            '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 8px;">' +
                '<div style="text-align: center; padding: 4px; background: rgba(16,185,129,0.15); border-radius: 4px;"><div style="font-size: 14px; color: #10b981; font-weight: bold;">' + evaluacion.sumaPositiva + '</div><div style="font-size: 8px; color: #888;">Positivos</div></div>' +
                '<div style="text-align: center; padding: 4px; background: rgba(245,158,11,0.15); border-radius: 4px;"><div style="font-size: 14px; color: #f59e0b; font-weight: bold;">' + evaluacion.sumaNeutra + '</div><div style="font-size: 8px; color: #888;">Neutros</div></div>' +
                '<div style="text-align: center; padding: 4px; background: rgba(239,68,68,0.15); border-radius: 4px;"><div style="font-size: 14px; color: #ef4444; font-weight: bold;">' + evaluacion.sumaNegativa + '</div><div style="font-size: 8px; color: #888;">Negativos</div></div>' +
                '<div style="text-align: center; padding: 4px; background: rgba(139,92,246,0.15); border-radius: 4px;"><div style="font-size: 14px; color: #8b5cf6; font-weight: bold;">' + evaluacion.completitud + '%</div><div style="font-size: 8px; color: #888;">Completitud</div></div>' +
            '</div>' +
            '<details style="margin-top: 6px;"><summary style="font-size: 10px; color: #8b5cf6; cursor: pointer; font-weight: bold;">🔍 Ver los 10 parámetros ternarios</summary>' +
            '<table style="width: 100%; margin-top: 6px; border-collapse: collapse;"><thead><tr style="font-size: 9px; color: #666; border-bottom: 1px solid #333;"><th style="text-align: left; padding: 2px 4px;">Parámetro</th><th style="text-align: center; padding: 2px 4px;">Valor</th><th style="text-align: center; padding: 2px 4px;">Estado</th></tr></thead>' +
            '<tbody>' + tablaParametros + '</tbody></table></details>' +
            '<div style="font-size: 8px; color: #555; margin-top: 6px; text-align: center;">🕰️ ' + new Date(evaluacion.timestamp).toLocaleString('es-ES') + ' · Filtro analógico aplicado</div>' +
            '</div>';
    },

    // ─────────────────────────────────────
    // 6. ESTADÍSTICAS
    // ─────────────────────────────────────
    getEstadisticas: function() {
        if (this.historial.length === 0) return { total: 0, positivos: 0, negativos: 0, neutros: 0, porcentajePositivo: 0, porcentajeNeutro: 0, porcentajeNegativo: 0, completitudPromedio: 0 };
        const total = this.historial.length;
        const positivos = this.historial.filter(e => e.valorTernario === 1).length;
        const negativos = this.historial.filter(e => e.valorTernario === -1).length;
        const neutros = this.historial.filter(e => e.valorTernario === 0).length;
        const completitudPromedio = this.historial.reduce((a, e) => a + e.completitud, 0) / total;
        return {
            total: total,
            positivos: positivos,
            negativos: negativos,
            neutros: neutros,
            porcentajePositivo: Math.round((positivos / total) * 100),
            porcentajeNeutro: Math.round((neutros / total) * 100),
            porcentajeNegativo: Math.round((negativos / total) * 100),
            completitudPromedio: Math.round(completitudPromedio)
        };
    },

    // ─────────────────────────────────────
    // 7. CARGAR HISTORIAL DESDE LOCALSTORAGE
    // ─────────────────────────────────────
    cargarHistorial: function() {
        try {
            const saved = localStorage.getItem('setun_historial');
            if (saved) {
                this.historial = JSON.parse(saved);
                console.log('🧬 Historial Setun cargado: ' + this.historial.length + ' análisis');
            }
        } catch(e) {
            this.historial = [];
        }
    }
};

window.SetunCore.cargarHistorial();
console.log('🧬 Setun Core v2.0-historia cargado. 10 parámetros ternarios activos.');
