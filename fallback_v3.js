function generarFallbackHistorico(titulo, era, hook, datos = {}) {
    try {
        const fuentes = datos?.fuentes || {};
        const agentReach = datos?.agentReach || {};
        const arGithub = Array.isArray(agentReach.github) ? agentReach.github : [];
        const arWiki = Array.isArray(agentReach.wiki) ? agentReach.wiki : [];
        const arReddit = Array.isArray(agentReach.reddit) ? agentReach.reddit : [];
        
        const fuentesArr = Object.entries(fuentes).filter(([_, f]) => f && f.count > 0);
        const totalFuentes = fuentesArr.reduce((sum, [_, f]) => sum + f.count, 0);
        const totalAgent = arGithub.length + arWiki.length + arReddit.length;
        
        const wikidataItems = fuentes['Wikidata']?.data || [];
        const timelineItems = fuentes['Wikidata Timeline']?.data || [];
        const wikiRestItems = fuentes['Wikipedia REST']?.data || [];
        const europeanaItems = fuentes['Europeana']?.data || [];
        const locItems = fuentes['LOC Chronicling']?.data || [];
        const archiveItems = fuentes['Internet Archive']?.data || [];
        const dbpediaItems = fuentes['DBpedia']?.data || [];
        const wikiquoteItems = fuentes['Wikiquote']?.data || [];
        const gutenbergItems = fuentes['Gutenberg']?.data || [];
        
        const eraMatch = String(era).match(/(\\d{3,4})/);
        const añoEvento = eraMatch ? parseInt(eraMatch[0]) : 0;
        
        const cronologia = [];
        [...timelineItems, ...wikidataItems, ...archiveItems, ...dbpediaItems, ...gutenbergItems].forEach(item => {
            if (item.year && item.year !== 's.f.') {
                const match = String(item.year).match(/\\d{3,4}/);
                if (match) {
                    const yearNum = parseInt(match[0]);
                    if (yearNum > 0 && yearNum < 2100 && !cronologia.find(c => c.yearNum === yearNum && c.titulo === item.titulo)) {
                        cronologia.push({ year: match[0], yearNum, titulo: item.titulo, fuente: item.fuente });
                    }
                }
            }
        });
        cronologia.sort((a, b) => a.yearNum - b.yearNum);
        
        const cronologiaLimpia = deduplicarCronologia(filtrarCronologiaBasura(cronologia));
        const figuras = (entidades && entidades.entidades) ? entidades.entidades.slice(0, 12) : [];
        const citas = wikiquoteItems.filter(w => w.resumen).slice(0, 5);
        
        let analisis = '';
        
        // SECCIÓN 1: CONTEXTO HISTÓRICO
        analisis += 'Contexto Histórico:\\n\\n';
        analisis += titulo + ' (' + era + ') representa un momento crucial en la historia universal. ' + hook + '\\n\\n';
        analisis += 'Para comprender plenamente la magnitud de este evento, es necesario remontarse a las condiciones políticas, sociales, económicas y culturales que lo hicieron posible. Los historiadores coinciden en señalar que ' + titulo + ' no fue un hecho aislado, sino el resultado de tensiones acumuladas durante décadas, incluso siglos, que encontraron en este episodio su punto de ebullición. La confluencia de factores estructurales y coyunturales creó un escenario donde lo impensable se volvió inevitable.\\n\\n';
        
        if (wikiRestItems.length > 0 && wikiRestItems[0].resumen) {
            analisis += 'Según los registros enciclopédicos disponibles, ' + wikiRestItems[0].resumen.substring(0, 600) + '. Este resumen, aunque breve, captura la esencia del evento y sirve como punto de partida para un análisis más profundo.\\n\\n';
        }
        if (dbpediaItems.length > 0 && dbpediaItems[0].resumen) {
            analisis += 'Los datos estructurados de DBpedia complementan esta visión al señalar que ' + dbpediaItems[0].resumen.substring(0, 500) + '. Esta información, extraída de ontologías semánticas, permite contextualizar el evento dentro de redes más amplias de conocimiento histórico.\\n\\n';
        }
        
        analisis += 'El análisis debe abordar múltiples dimensiones. En el plano político, ' + titulo + ' revela las tensiones entre el poder establecido y las fuerzas de cambio. En el ámbito económico, expone las contradicciones de un sistema que priorizaba ciertos intereses sobre otros. En lo social, evidencia las fracturas y desigualdades que atravesaban la sociedad de la época. Y en lo cultural, muestra cómo el conocimiento, la memoria y la identidad se convirtieron en campos de batalla.\\n\\n';
        
        analisis += 'La relevancia contemporánea de este episodio radica en su capacidad para iluminar dinámicas que persisten en la actualidad. Las lecciones que emanan de ' + titulo + ' no son meras curiosidades históricas, sino advertencias y guías para comprender los desafíos del presente. Como señalara el filósofo George Santayana, \"aquellos que no recuerdan el pasado están condenados a repetirlo\".\\n\\n';
        
        // SECCIÓN 2: CRONOLOGÍA
        if (cronologiaLimpia.length > 0) {
            analisis += 'Cronología Detallada (' + cronologiaLimpia.length + ' eventos fechados):\\n\\n';
            cronologiaLimpia.slice(0, 15).forEach((c, i) => {
                analisis += (i + 1) + '. ' + c.year + ': ' + c.titulo + ' [Fuente: ' + c.fuente + ']\\n';
                analisis += '   Este evento se inscribe en el contexto más amplio de ' + titulo + ', contribuyendo a configurar el escenario histórico que analizamos.\\n\\n';
            });
        } else {
            analisis += 'Cronología Detallada:\\n\\n';
            analisis += 'Aunque las fuentes consultadas no proporcionaron una cronología exhaustiva de eventos fechados, es posible reconstruir la secuencia temporal a partir de las referencias académicas disponibles. ' + titulo + ' se desarrolló en ' + era + ', y sus efectos se extendieron por décadas, incluso siglos. La ausencia de una cronología detallada en las fuentes digitales no resta importancia al evento, sino que subraya la necesidad de recurrir a archivos históricos primarios para una comprensión más completa.\\n\\n';
        }
        
        // SECCIÓN 3: FIGURAS Y ENTIDADES
        if (figuras.length > 0) {
            analisis += 'Figuras y Entidades Identificadas (' + figuras.length + '):\\n\\n';
            analisis += 'El análisis de las entidades extraídas de las fuentes revela una red compleja de actores y lugares que configuran el escenario de ' + titulo + '. Entre ellas destacan:\\n\\n';
            figuras.forEach(f => {
                analisis += '• ' + f + ': Su presencia en las fuentes sugiere un papel relevante en el desarrollo de los acontecimientos. La investigación histórica ha demostrado que figuras como esta contribuyeron a moldear el curso de los eventos, ya sea como protagonistas, testigos o víctimas.\\n';
            });
            analisis += '\\nEl estudio prosopográfico de estas entidades permite reconstruir las redes de poder, influencia y resistencia que operaban en ' + era + '. Lejos de ser meros nombres en un registro, cada una de estas figuras encarna las tensiones y contradicciones de su tiempo.\\n\\n';
        } else {
            analisis += 'Figuras y Entidades:\\n\\n';
            analisis += 'Las fuentes consultadas no proporcionaron una lista exhaustiva de figuras y entidades asociadas a ' + titulo + '. Sin embargo, es posible inferir que en un evento de tal magnitud participaron múltiples actores: líderes políticos, intelectuales, testigos directos y comunidades afectadas. La investigación futura debería profundizar en el estudio de estas figuras para comprender mejor las dinámicas de poder en juego.\\n\\n';
        }
        
        // SECCIÓN 4: CITAS Y REFERENCIAS
        if (citas.length > 0) {
            analisis += 'Citas y Referencias Textuales (' + citas.length + '):\\n\\n';
            citas.forEach(c => {
                analisis += '💭 \"' + c.resumen.substring(0, 250) + '\" — ' + c.titulo + '\\n\\n';
                analisis += 'Esta cita ofrece una perspectiva valiosa sobre ' + titulo + ', permitiendo comprender las percepciones y valoraciones que diversos autores han hecho del evento a lo largo del tiempo. El análisis discursivo de estas fuentes revela cómo la memoria histórica se construye y reconstruye continuamente.\\n\\n';
            });
        } else {
            analisis += 'Citas y Referencias Textuales:\\n\\n';
            analisis += 'Aunque Wikiquote no devolvió citas específicas para ' + titulo + ', las fuentes académicas proporcionan fragmentos textuales que permiten reconstruir el discurso histórico en torno al evento. La investigación futura debería consultar archivos primarios, como crónicas, cartas y documentos oficiales, para acceder a las voces directas de los protagonistas.\\n\\n';
        }
        
        // SECCIÓN 5: HECHOS CLAVE
        analisis += 'Hechos Clave:\\n\\n';
        analisis += 'El análisis de ' + titulo + ' debe articularse en torno a una serie de hechos fundamentales que configuran su significado histórico:\\n\\n';
        analisis += '1. Origen y detonantes: El evento se desarrolló en ' + era + ', en un contexto de transformaciones profundas. Las condiciones previas —políticas, económicas, sociales y culturales— crearon un escenario propicio para la irrupción de ' + titulo + '. Los factores desencadenantes deben buscarse en las tensiones acumuladas durante décadas, en la competencia por recursos, en las disputas ideológicas y en las dinámicas de poder que atravesaban la sociedad de la época.\\n\\n';
        analisis += '2. Desarrollo y protagonistas: Los protagonistas y testigos documentaron los sucesos con base en fuentes primarias y secundarias. La reconstrucción de los hechos permite identificar fases diferenciadas en el desarrollo del evento, desde los primeros indicios hasta el clímax y sus consecuencias inmediatas. Los relatos de testigos directos, aunque fragmentarios, ofrecen una ventana invaluable a la experiencia subjetiva de quienes vivieron los acontecimientos.\\n\\n';
        analisis += '3. Consecuencias inmediatas y de largo plazo: Las consecuencias se extendieron por décadas, afectando generaciones enteras. En el corto plazo, el evento transformó el orden establecido, generando nuevos equilibrios de poder y reconfigurando las instituciones existentes. A mediano plazo, las transformaciones se institucionalizaron, dando lugar a nuevas formas de organización social y política. A largo plazo, el legado de ' + titulo + ' persistió en la memoria colectiva, configurando identidades y narrativas que perduran hasta la actualidad.\\n\\n';
        analisis += '4. Interpretaciones y debates historiográficos: La historiografía sobre ' + titulo + ' ha generado intensos debates. Algunos autores enfatizan los factores estructurales, mientras que otros subrayan el papel de las decisiones individuales y las contingencias. La investigación reciente ha incorporado nuevas perspectivas, como la historia de género, la historia ambiental y la historia global, que enriquecen la comprensión del evento.\\n\\n';
        
        // SECCIÓN 6: FUENTES ACADÉMICAS
        analisis += 'Fuentes Académicas (' + totalFuentes + ' referencias de ' + fuentesArr.length + ' repositorios):\\n\\n';
        fuentesArr.forEach(([nombre, f]) => {
            analisis += '📚 [' + nombre + '] ' + f.count + ' referencias:\\n';
            f.data.slice(0, 5).forEach(r => {
                analisis += '  • ' + (r.autor || '') + ' ' + (r.year ? '(' + r.year + ')' : '') + ' \"' + (r.titulo || '').substring(0, 120) + '\"';
                if (r.url) analisis += ' → ' + r.url.substring(0, 80);
                analisis += '\\n';
                if (r.resumen) analisis += '    ' + r.resumen.substring(0, 200) + '\\n';
            });
            analisis += '\\n';
        });
        
        // SECCIÓN 7: RECURSOS HISTÓRICOS
        if (europeanaItems.length > 0 || locItems.length > 0 || archiveItems.length > 0 || gutenbergItems.length > 0) {
            analisis += 'Recursos Históricos Especiales:\\n\\n';
            if (europeanaItems.length > 0) {
                analisis += '🏛️ Europeana (' + europeanaItems.length + '):\\n';
                europeanaItems.slice(0, 3).forEach(r => {
                    analisis += '  • ' + r.titulo + ' (' + (r.year || 's.f.') + ')\\n    Fuente: ' + (r.url?.substring(0, 80) || 'Europeana') + '\\n';
                });
                analisis += '\\nEuropeana proporciona acceso a patrimonio cultural digitalizado de toda Europa, ofreciendo una ventana única a documentos, imágenes y objetos que contextualizan ' + titulo + '.\\n\\n';
            }
            if (locItems.length > 0) {
                analisis += '📰 LOC Chronicling America (' + locItems.length + '):\\n';
                locItems.slice(0, 3).forEach(r => {
                    analisis += '  • ' + r.titulo + ' (' + r.year + ')\\n';
                });
                analisis += '\\nLos archivos de la Biblioteca del Congreso de Estados Unidos permiten acceder a periódicos históricos que documentan la recepción de ' + titulo + ' en la prensa de la época.\\n\\n';
            }
            if (archiveItems.length > 0) {
                analisis += '🏛️ Internet Archive (' + archiveItems.length + '):\\n';
                archiveItems.slice(0, 3).forEach(r => {
                    analisis += '  • ' + r.titulo + ' (' + r.year + ') — ' + r.autor + '\\n';
                });
                analisis += '\\nInternet Archive preserva millones de textos, audio y video que constituyen una memoria digital de la humanidad.\\n\\n';
            }
            if (gutenbergItems.length > 0) {
                analisis += '📖 Project Gutenberg (' + gutenbergItems.length + '):\\n';
                gutenbergItems.slice(0, 3).forEach(r => {
                    analisis += '  • ' + r.titulo + ' — ' + r.autor + '\\n';
                });
                analisis += '\\nProject Gutenberg ofrece acceso libre a libros de dominio público, muchos de los cuales son fuentes primarias para el estudio de ' + titulo + '.\\n\\n';
            }
        }
        
        // SECCIÓN 8: AGENT-REACH
        if (totalAgent > 0) {
            analisis += 'Datos en Tiempo Real (Agent-Reach · ' + totalAgent + ' resultados):\\n\\n';
            if (arGithub.length) {
                analisis += '📦 GitHub (' + arGithub.length + '):\\n';
                arGithub.slice(0, 5).forEach(r => {
                    analisis += '  • ' + r.titulo + ' ⭐' + (r.estrellas || 0) + '\\n';
                });
                analisis += '\\nLos repositorios de GitHub ofrecen proyectos, datasets y herramientas que pueden enriquecer la investigación sobre ' + titulo + '.\\n\\n';
            }
            if (arWiki.length) {
                analisis += '🌐 Wikipedia (' + arWiki.length + '):\\n';
                arWiki.slice(0, 5).forEach(r => {
                    analisis += '  • ' + r.titulo + '\\n';
                });
                analisis += '\\nWikipedia, aunque no exenta de críticas, constituye un punto de partida accesible para la investigación histórica.\\n\\n';
            }
            if (arReddit.length) {
                analisis += '📖 Reddit (' + arReddit.length + '):\\n';
                arReddit.slice(0, 5).forEach(r => {
                    analisis += '  • r/' + r.subreddit + ': ' + r.titulo + '\\n';
                });
                analisis += '\\nReddit ofrece discusiones contemporáneas que reflejan cómo las comunidades digitales interpretan y debaten sobre ' + titulo + '. Estos foros, aunque informales, constituyen un termómetro del interés público y de las controversias que el evento sigue generando en la actualidad.\\n\\n';
            }
        } else {
            analisis += 'Datos en Tiempo Real (Agent-Reach):\\n\\n';
            analisis += 'En esta consulta, Agent-Reach no devolvió resultados desde GitHub, Wikipedia ni Reddit. Esto puede deberse a limitaciones temporales de las APIs o a la especificidad del término consultado. Se recomienda reintentar la búsqueda o ampliar los términos para obtener datos en tiempo real.\\n\\n';
        }
        
        // SECCIÓN 9: EVALUACIÓN SETUN
        const evaluacionSetun = window.SetunCore ? window.SetunCore.evaluarAnalisis({
            fuentesActivas: fuentesArr.length,
            fuentesExitosas: fuentesArr.length,
            eventosCronologia: cronologiaLimpia.length,
            entidades: figuras.length,
            citas: citas.length,
            rangoTemporal: 100,
            totalReferencias: totalFuentes,
            palabras: analisis.split(/\\s+/).length,
            tono: 'Equilibrado',
            agentReach: totalAgent,
            fuentesRecientes: 0
        }) : null;
        
        if (evaluacionSetun) {
            analisis += 'Evaluación Setun 1958 (Lógica Ternaria):\\n\\n';
            analisis += 'El núcleo Setun, emulando la histórica computadora soviética de 1958, ha evaluado este análisis con ' + evaluacionSetun.totalParametros + ' parámetros ponderados. El resultado es ' + evaluacionSetun.estado + ' con una confianza ' + evaluacionSetun.nivelConfianza + '.\\n\\n';
            analisis += evaluacionSetun.mensaje + '\\n\\n';
            analisis += 'Desglose: ' + evaluacionSetun.sumaPositiva + ' parámetros positivos, ' + evaluacionSetun.sumaNeutra + ' neutros y ' + evaluacionSetun.sumaNegativa + ' negativos. La completitud del análisis alcanza el ' + evaluacionSetun.completitud + '%.\\n\\n';
            
            const parametrosCriticos = evaluacionSetun.parametros.filter(p => p.ternario === -1);
            if (parametrosCriticos.length > 0) {
                analisis += 'Parámetros que requieren atención:\\n';
                parametrosCriticos.forEach(p => {
                    analisis += '• ' + p.nombre + ': valor ' + p.valor + ' (estado -1, peso ' + p.peso + ')\\n';
                });
                analisis += '\\nEstos indicadores sugieren áreas donde el análisis podría fortalecerse con fuentes adicionales o mayor profundidad.\\n\\n';
            }
            
            analisis += 'La lógica ternaria de Setun (−1, 0, +1) ofrece una alternativa al binarismo tradicional, permitiendo representar la incertidumbre y la ambigüedad inherentes al análisis histórico. Frente a la dicotomía verdadero/falso, Setun introduce el \"quizás\" como categoría legítima de conocimiento.\\n\\n';
            
            if (document.getElementById('setunStatus')) {
                document.getElementById('setunStatus').textContent = '✅ ' + evaluacionSetun.estado;
                document.getElementById('setunStatus').style.color = evaluacionSetun.color;
                document.getElementById('setunTernario').textContent = evaluacionSetun.valorTernario;
                document.getElementById('setunCount').textContent = window.SetunCore.historial.length;
            }
            window._ultimaEvaluacionSetun = evaluacionSetun;
        }
        
        // SECCIÓN 10: CONCLUSIONES
        analisis += 'Conclusiones:\\n\\n';
        analisis += titulo + ' constituye un episodio fundamental para comprender la historia universal. A lo largo de este análisis, hemos examinado sus orígenes, desarrollo, consecuencias e interpretaciones, recurriendo a ' + totalFuentes + ' referencias de ' + fuentesArr.length + ' repositorios académicos y ' + totalAgent + ' resultados en tiempo real.\\n\\n';
        analisis += 'La investigación histórica sobre ' + titulo + ' no está cerrada. Nuevas fuentes, nuevas metodologías y nuevas preguntas siguen enriqueciendo nuestra comprensión del evento. La digitalización de archivos, la inteligencia artificial aplicada al análisis textual y la colaboración internacional entre historiadores prometen avances significativos en los próximos años.\\n\\n';
        analisis += 'Desde una perspectiva crítica, es importante reconocer las limitaciones de este análisis. Las fuentes digitales, aunque valiosas, no sustituyen la investigación en archivos primarios. Los sesgos de las plataformas —desde la sobrerrepresentación de ciertas lenguas hasta la infrarrepresentación de comunidades marginadas— deben tenerse en cuenta al interpretar los resultados. La historia no es solo lo que ocurrió, sino también lo que se cuenta y cómo se cuenta.\\n\\n';
        analisis += 'Finalmente, ' + titulo + ' nos invita a reflexionar sobre nuestra relación con el pasado. La memoria histórica no es un depósito pasivo de datos, sino una construcción activa en la que participamos todos. Comprender ' + titulo + ' no es solo un ejercicio académico, sino una forma de iluminar el presente y de imaginar futuros posibles.\\n\\n';
        analisis += 'Como señalara Marc Bloch, \"la historia es la ciencia de los hombres en el tiempo\". ' + titulo + ' nos recuerda que, pese a la distancia temporal, seguimos conectados con quienes vivieron esos acontecimientos por los hilos de la condición humana compartida: la esperanza, el miedo, la ambición, la solidaridad y la resistencia.\\n\\n';
        
        // SECCIÓN 11: NOTA METODOLÓGICA
        analisis += 'Nota Metodológica:\\n\\n';
        analisis += 'Este análisis fue generado por Newtral en modo fallback, utilizando exclusivamente las fuentes disponibles en el momento de la consulta. No se trata de una investigación histórica original, sino de una síntesis de los datos recuperados de ' + (fuentesArr.map(([n]) => n).join(', ') || 'repositorios académicos') + '.\\n\\n';
        analisis += 'La generación del texto sigue un modelo de plantillas enriquecidas que combinan datos estructurados con narrativa histórica general. Cada sección se construye a partir de los datos disponibles, adaptándose a la presencia o ausencia de fuentes. Cuando una fuente no proporciona información, el texto lo indica explícitamente y ofrece alternativas interpretativas.\\n\\n';
        analisis += 'La evaluación Setun 1958 aplica un filtro analógico sobre 30 parámetros ternarios, emulando la lógica de la histórica computadora soviética. Los pesos asignados a cada parámetro son configurables y buscan equilibrar la relevancia de las distintas dimensiones del análisis.\\n\\n';
        analisis += 'Para una investigación histórica rigurosa, se recomienda consultar las fuentes primarias y secundarias citadas, así como ampliar la búsqueda en archivos especializados. Este análisis debe considerarse un punto de partida, no un producto final.\\n\\n';
        
        analisis += '— Generado por Newtral · Fallback Historiográfico v3 · ' + new Date().toLocaleString('es-ES');
        
        return analisis;
        
    } catch (e) {
        console.error('Error en fallback extendido:', e);
        return 'Contexto Histórico:\\n\\n' + titulo + ' (' + era + ') es un evento de gran relevancia histórica. ' + hook + '\\n\\nEl análisis detallado no pudo completarse.\\n\\n— Error: ' + e.message;
    }
}
