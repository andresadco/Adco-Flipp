// Generador de PDF profesional para ADCO Investments
// Usa jsPDF + jsPDF-AutoTable

export async function exportarPDF(datos, calc, escenarios) {
  // Import dinámico para no bloquear la app
  const { default: jsPDF } = await import('jspdf')
  await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210
  const azul = [71, 148, 215]
  const negro = [13, 13, 13]
  const gris = [107, 114, 128]
  const grisLt = [229, 232, 236]
  const verde = [21, 128, 61]
  const rojo = [220, 38, 38]
  const ambar = [217, 119, 6]
  const blanco = [255, 255, 255]

  const roiColor = calc.roi >= 20 ? verde : calc.roi >= 10 ? ambar : calc.roi >= 0 ? gris : rojo
  const netaColor = calc.neta >= 0 ? verde : rojo

  // ─── HELPER FUNCTIONS ──────────────────────────────────────
  const eur = (n) => {
    const abs = Math.abs(n)
    const sign = n < 0 ? '-' : ''
    if (abs >= 1_000_000) return sign + (abs / 1_000_000).toFixed(2) + 'M €'
    return sign + Math.round(abs).toLocaleString('es-ES') + ' €'
  }
  const pct = (n) => isFinite(n) ? n.toFixed(1) + '%' : '—'

  let y = 0 // cursor vertical

  // ─── PÁGINA 1: PORTADA + RESUMEN ───────────────────────────

  // Header negro
  doc.setFillColor(...negro)
  doc.rect(0, 0, W, 52, 'F')

  // Círculo logo ADCO (simplificado)
  doc.setDrawColor(...azul)
  doc.setLineWidth(0.8)
  doc.circle(20, 18, 8, 'S')
  doc.setLineWidth(0.5)
  doc.circle(20, 18, 5, 'S')
  doc.setFillColor(...azul)
  doc.circle(20, 18, 2, 'F')

  // ADCO texto
  doc.setTextColor(...blanco)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('ADCO', 32, 16)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...azul)
  doc.text('I N V E S T M E N T S', 32, 21)

  // Título del reporte
  doc.setTextColor(...blanco)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Simulador de Flipping Inmobiliario', 20, 35)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 180, 180)
  doc.text(`Reporte generado el ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}`, 20, 41)

  // Nombre proyecto + zona (derecha del header)
  doc.setTextColor(...azul)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(datos.nombre, W - 15, 14, { align: 'right' })
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 180, 180)
  doc.text(`Zona: ${datos.zona}`, W - 15, 20, { align: 'right' })

  // Línea azul bajo header
  doc.setFillColor(...azul)
  doc.rect(0, 52, W, 1.5, 'F')

  y = 62

  // ─── KPIs grandes ──────────────────────────────────────────
  const kpis = [
    { label: 'ROI Neto', value: pct(calc.roi),    sub: 'Sobre capital propio', color: roiColor },
    { label: 'TIR Anual', value: pct(calc.tir),   sub: `En ${datos.plazo} año${datos.plazo !== 1 ? 's' : ''}`, color: calc.tir >= 15 ? verde : calc.tir >= 8 ? ambar : rojo },
    { label: 'Ganancia Neta', value: eur(calc.neta), sub: 'Después de IRPF',  color: netaColor },
    { label: 'Inversión Total', value: eur(calc.invTotal), sub: 'Capital + Reforma', color: negro },
  ]

  const kpiW = (W - 40) / 4
  kpis.forEach((k, i) => {
    const x = 15 + i * (kpiW + 3)
    // Card fondo
    doc.setFillColor(248, 249, 250)
    doc.setDrawColor(...k.color)
    doc.setLineWidth(0.5)
    doc.roundedRect(x, y, kpiW, 26, 2, 2, 'FD')
    // Top accent line
    doc.setFillColor(...k.color)
    doc.rect(x, y, kpiW, 1.5, 'F')
    // Label
    doc.setTextColor(...gris)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'bold')
    doc.text(k.label.toUpperCase(), x + 4, y + 7)
    // Value
    doc.setTextColor(...k.color)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(k.value, x + 4, y + 17)
    // Sub
    doc.setTextColor(...gris)
    doc.setFontSize(6)
    doc.setFont('helvetica', 'normal')
    doc.text(k.sub, x + 4, y + 22.5)
  })

  y += 34

  // ─── RESUMEN EJECUTIVO ─────────────────────────────────────
  doc.setFillColor(...negro)
  doc.rect(15, y, W - 30, 7, 'F')
  doc.setTextColor(...blanco)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('RESUMEN EJECUTIVO', 19, y + 4.8)
  y += 10

  const filas = [
    ['Precio de compra',        eur(datos.pCompra),      null],
    ['Gastos de compra',        eur(calc.gcCompra),      null],
    ['Reforma (IVA incluido)',  eur(calc.reforma),       null],
    ['INVERSIÓN TOTAL',         eur(calc.invTotal),      'bold'],
    datos.useFin && ['Préstamo bancario',     eur(calc.prestamo),  'blue'],
    datos.useFin && ['Capital propio',        eur(calc.capPropio), 'green'],
    datos.useFin && ['Intereses del préstamo',eur(calc.intereses), 'neg'],
    ['Precio de venta',         eur(calc.ventaAdj),      null],
    ['Comisión de venta',       eur(calc.gcVenta),       'neg'],
    ['Ganancia bruta',          eur(calc.bruta),         calc.bruta >= 0 ? 'green' : 'neg'],
    ['IRPF estimado (escala 2025)', eur(calc.tax),       'neg'],
    ['GANANCIA NETA',           eur(calc.neta),          calc.neta >= 0 ? 'finGreen' : 'finRed'],
  ].filter(Boolean)

  filas.forEach((f, i) => {
    const [label, value, type] = f
    const fy = y + i * 7
    const isBold = type === 'bold' || type === 'finGreen' || type === 'finRed'

    // Fondo alterno
    if (type === 'finGreen') doc.setFillColor(240, 253, 244)
    else if (type === 'finRed') doc.setFillColor(254, 242, 242)
    else if (type === 'bold') doc.setFillColor(248, 249, 250)
    else doc.setFillColor(i % 2 === 0 ? 255 : 251, i % 2 === 0 ? 255 : 251, i % 2 === 0 ? 255 : 253)
    doc.rect(15, fy, W - 30, 7, 'F')

    // Borde izquierdo para totales
    if (isBold) {
      doc.setFillColor(...azul)
      doc.rect(15, fy, 2, 7, 'F')
    }

    // Label
    doc.setFontSize(isBold ? 7.5 : 7)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    doc.setTextColor(isBold ? ...negro : ...gris)
    doc.text(label, 20, fy + 4.5)

    // Value
    const valColor = type === 'green' || type === 'finGreen' ? verde
      : type === 'neg' || type === 'finRed' ? rojo
      : type === 'blue' ? azul
      : negro
    doc.setTextColor(...valColor)
    doc.setFont('helvetica', 'bold')
    doc.text(value, W - 16, fy + 4.5, { align: 'right' })

    // Línea separadora
    doc.setDrawColor(...grisLt)
    doc.setLineWidth(0.2)
    doc.line(15, fy + 7, W - 15, fy + 7)
  })

  y += filas.length * 7 + 8

  // ─── DATOS DEL PROYECTO ────────────────────────────────────
  if (y < 220) {
    doc.setFillColor(...negro)
    doc.rect(15, y, W - 30, 7, 'F')
    doc.setTextColor(...blanco)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('DATOS DEL PROYECTO', 19, y + 4.8)
    y += 10

    const datosGrid = [
      ['Zona', datos.zona],
      ['Superficie total', datos.m2Total + ' m²'],
      ['Superficie a reformar', datos.m2Reform + ' m²'],
      ['Coste reforma/m²', eur(datos.costM2)],
      ['IVA reforma', datos.ivaRef + '%'],
      ['Precio de compra', eur(datos.pCompra)],
      ['ITP/IVA compra', datos.itp + '%'],
      ['Precio de venta', eur(datos.pVenta)],
      ['Comisión venta', datos.comVenta + '%'],
      datos.useFin && ['Financiación', datos.pctPrest + '% al ' + datos.tasaInt + '% — ' + datos.plazo + ' año(s)'],
    ].filter(Boolean)

    const colW = (W - 30) / 2 - 2
    datosGrid.forEach((d, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      const dx = 15 + col * (colW + 4)
      const dy = y + row * 7

      doc.setFillColor(col === 0 ? 248 : 252, 249, 250)
      doc.rect(dx, dy, colW, 7, 'F')
      doc.setTextColor(...gris)
      doc.setFontSize(6.5)
      doc.setFont('helvetica', 'normal')
      doc.text(d[0], dx + 3, dy + 3)
      doc.setTextColor(...negro)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text(d[1], dx + 3, dy + 5.8)
    })

    y += Math.ceil(datosGrid.length / 2) * 7
  }

  // ─── PÁGINA 2: ESCENARIOS + ANÁLISIS ──────────────────────
  doc.addPage()

  // Header página 2
  doc.setFillColor(...negro)
  doc.rect(0, 0, W, 20, 'F')
  doc.setFillColor(...azul)
  doc.rect(0, 20, W, 1, 'F')

  doc.setTextColor(...blanco)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('ADCO Investments', 15, 10)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 180, 180)
  doc.text(datos.nombre + ' · Análisis de Escenarios', 15, 16)
  doc.setTextColor(...azul)
  doc.text('Página 2/2', W - 15, 13, { align: 'right' })

  y = 30

  // ─── TABLA DE ESCENARIOS ───────────────────────────────────
  doc.setFillColor(...negro)
  doc.rect(15, y, W - 30, 7, 'F')
  doc.setTextColor(...blanco)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('ANÁLISIS DE ESCENARIOS', 19, y + 4.8)
  y += 10

  // Headers tabla
  const cols = ['Variación', 'Precio de Venta', 'Ganancia Bruta', 'IRPF', 'Ganancia Neta', 'ROI']
  const colsW = [25, 38, 35, 28, 38, 22]
  let cx = 15
  doc.setFillColor(...azul)
  doc.rect(15, y, W - 30, 8, 'F')
  cols.forEach((c, i) => {
    doc.setTextColor(...blanco)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'bold')
    doc.text(c, cx + 3, y + 5.2)
    cx += colsW[i]
  })
  y += 8

  escenarios.forEach((e, idx) => {
    const isBase = e.v === 0
    const bg = isBase ? [235, 244, 252] : idx % 2 === 0 ? [255, 255, 255] : [251, 251, 253]
    doc.setFillColor(...bg)
    doc.rect(15, y, W - 30, 7.5, 'F')

    if (isBase) {
      doc.setFillColor(...azul)
      doc.rect(15, y, 2, 7.5, 'F')
    }

    const bruta = e.venta * (1 - datos.comVenta / 100) - calc.invTotal - calc.intereses
    const tax = irpfSimple(bruta)

    const vColor = e.v > 0 ? verde : e.v < 0 ? rojo : azul
    const nColor = e.neta >= 0 ? verde : rojo
    const rColor = e.roi >= 20 ? verde : e.roi >= 10 ? ambar : e.roi >= 0 ? gris : rojo

    cx = 15
    const vals = [
      { text: (e.v > 0 ? '+' : '') + e.v + '%', color: vColor, bold: true },
      { text: eur(e.venta),                       color: negro,  bold: false },
      { text: eur(bruta),                         color: bruta >= 0 ? verde : rojo, bold: false },
      { text: eur(tax),                           color: rojo,   bold: false },
      { text: eur(e.neta),                        color: nColor, bold: true },
      { text: pct(e.roi),                         color: rColor, bold: true },
    ]

    vals.forEach((v, i) => {
      doc.setTextColor(...v.color)
      doc.setFontSize(7)
      doc.setFont('helvetica', v.bold ? 'bold' : 'normal')
      doc.text(v.text, cx + 3, y + 5)
      doc.setDrawColor(...grisLt)
      doc.setLineWidth(0.1)
      doc.line(cx + colsW[i], y, cx + colsW[i], y + 7.5)
      cx += colsW[i]
    })

    doc.setDrawColor(...grisLt)
    doc.setLineWidth(0.2)
    doc.line(15, y + 7.5, W - 15, y + 7.5)

    y += 7.5
  })

  y += 10

  // ─── GRÁFICO BARRAS ESCENARIOS (manual) ────────────────────
  doc.setFillColor(...negro)
  doc.rect(15, y, W - 30, 7, 'F')
  doc.setTextColor(...blanco)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('VISUALIZACIÓN DE GANANCIA POR ESCENARIO', 19, y + 4.8)
  y += 10

  const chartH = 40
  const chartW = W - 30
  const chartX = 15
  const chartY = y
  const barGap = 4
  const barsN = escenarios.length
  const barW2 = (chartW - barGap * (barsN + 1)) / barsN
  const maxNeta = Math.max(...escenarios.map(e => Math.abs(e.neta)), 1)

  // Fondo chart
  doc.setFillColor(248, 249, 250)
  doc.rect(chartX, chartY, chartW, chartH, 'F')

  // Línea base
  const baseY = chartY + chartH - 8
  doc.setDrawColor(...negro)
  doc.setLineWidth(0.5)
  doc.line(chartX, baseY, chartX + chartW, baseY)

  escenarios.forEach((e, i) => {
    const bx = chartX + barGap + i * (barW2 + barGap)
    const barH = Math.max((Math.abs(e.neta) / maxNeta) * (chartH - 14), 2)
    const isPos = e.neta >= 0
    const isBase = e.v === 0

    doc.setFillColor(...(isPos ? verde : rojo))
    if (isBase) doc.setDrawColor(...azul)
    doc.roundedRect(bx, baseY - barH, barW2, barH, 1, 1, isBase ? 'FD' : 'F')

    // Label variación
    doc.setTextColor(...(e.v > 0 ? verde : e.v < 0 ? rojo : azul))
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'bold')
    doc.text((e.v > 0 ? '+' : '') + e.v + '%', bx + barW2 / 2, baseY + 4, { align: 'center' })

    // Valor encima barra
    doc.setTextColor(...(isPos ? verde : rojo))
    doc.setFontSize(5.5)
    doc.setFont('helvetica', 'bold')
    const valText = eur(e.neta).replace(' €', '€').replace(' €', '€')
    doc.text(valText, bx + barW2 / 2, baseY - barH - 1.5, { align: 'center' })
  })

  y += chartH + 10

  // ─── NOTAS Y DISCLAIMERS ────────────────────────────────────
  doc.setFillColor(240, 253, 244)
  doc.setDrawColor(...verde)
  doc.setLineWidth(0.3)
  doc.roundedRect(15, y, W - 30, 22, 2, 2, 'FD')
  doc.setFillColor(...verde)
  doc.rect(15, y, 2, 22, 'F')

  doc.setTextColor(...verde)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.text('✓ Metodología de cálculo', 20, y + 6)
  doc.setTextColor(30, 80, 50)
  doc.setFontSize(6.5)
  doc.setFont('helvetica', 'normal')
  doc.text('• ROI calculado sobre capital propio (no inversión total)', 20, y + 11)
  doc.text('• TIR anualizada mediante fórmula compuesta según plazo del préstamo', 20, y + 15.5)
  doc.text('• IRPF aplicado según escala de ganancias patrimoniales 2025 (19%–26%)', 20, y + 20)

  y += 28

  doc.setFillColor(254, 249, 235)
  doc.setDrawColor(...ambar)
  doc.roundedRect(15, y, W - 30, 16, 2, 2, 'FD')
  doc.setFillColor(...ambar)
  doc.rect(15, y, 2, 16, 'F')

  doc.setTextColor(...ambar)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.text('⚠  Aviso legal', 20, y + 6)
  doc.setTextColor(100, 70, 0)
  doc.setFontSize(6)
  doc.setFont('helvetica', 'normal')
  doc.text('Este reporte es orientativo y no constituye asesoramiento financiero ni fiscal. Los datos de mercado son', 20, y + 10.5)
  doc.text('estimaciones basadas en fuentes públicas (Fotocasa/Idealista Q4 2025). Consulte con un asesor antes de invertir.', 20, y + 14.5)

  // ─── FOOTER ────────────────────────────────────────────────
  doc.setFillColor(...negro)
  doc.rect(0, 282, W, 15, 'F')
  doc.setTextColor(...azul)
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.text('ADCO Investments', 15, 290)
  doc.setTextColor(130, 130, 130)
  doc.setFont('helvetica', 'normal')
  doc.text('andres@adco.es', 80, 290)
  doc.text('Generado con ADCO Flipping Simulator', W - 15, 290, { align: 'right' })

  // Guardar
  const filename = `ADCO_${datos.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
}

// IRPF simplificado para cálculos internos del PDF
function irpfSimple(g) {
  if (g <= 0)        return 0
  if (g <= 6_000)    return g * 0.19
  if (g <= 50_000)   return 6_000 * 0.19 + (g - 6_000) * 0.21
  if (g <= 200_000)  return 6_000 * 0.19 + 44_000 * 0.21 + (g - 50_000) * 0.23
  return               6_000 * 0.19 + 44_000 * 0.21 + 150_000 * 0.23 + (g - 200_000) * 0.26
}
