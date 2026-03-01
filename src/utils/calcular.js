function irpf(g) {
  if (g <= 0)        return 0
  if (g <= 6_000)    return g * 0.19
  if (g <= 50_000)   return 6_000 * 0.19 + (g - 6_000) * 0.21
  if (g <= 200_000)  return 6_000 * 0.19 + 44_000 * 0.21 + (g - 50_000) * 0.23
  return               6_000 * 0.19 + 44_000 * 0.21 + 150_000 * 0.23 + (g - 200_000) * 0.26
}

export function calcular(d, varPct = 0) {
  const reforma   = d.m2Reform * d.costM2 * (1 + d.ivaRef / 100) + d.costExtra
  const gcCompra  = d.pCompra * (d.comCompra / 100) + d.gLeg + d.gAdm + d.pCompra * (d.itp / 100) + d.ibi
  const invTotal  = d.pCompra + gcCompra + reforma

  const prestamo  = d.useFin ? invTotal * (d.pctPrest / 100) : 0
  const capPropio = invTotal - prestamo
  const intereses = prestamo * (d.tasaInt / 100) * d.plazo

  const ventaAdj  = d.pVenta * (1 + varPct / 100)
  const gcVenta   = ventaAdj * (d.comVenta / 100)
  const bruta     = ventaAdj - gcVenta - invTotal - intereses
  const tax       = irpf(bruta)
  const neta      = bruta - tax

  const roi       = capPropio > 0 ? (neta / capPropio) * 100 : 0
  const tir       = d.plazo > 0 ? (Math.pow(1 + roi / 100, 1 / d.plazo) - 1) * 100 : roi
  const sug20     = (invTotal + intereses) * 1.2 / (1 - d.comVenta / 100)
  const m2Venta   = d.m2Total > 0 ? ventaAdj / d.m2Total : 0
  const breakEven = (invTotal + intereses) / (1 - d.comVenta / 100)
  const multiple  = capPropio > 0 ? (neta + capPropio) / capPropio : 0

  return {
    reforma, gcCompra, invTotal,
    prestamo, capPropio, intereses,
    ventaAdj, gcVenta, bruta, tax, neta,
    roi, tir, sug20, m2Venta, breakEven, multiple
  }
}

export function calcularEscenarios(d, calc) {
  return [-20, -10, 0, 10, 20].map(v => {
    const venta = d.pVenta * (1 + v / 100)
    const gv    = venta * (d.comVenta / 100)
    const br    = venta - gv - calc.invTotal - calc.intereses
    const nt    = br - irpf(br)
    return { v, venta, neta: nt, roi: calc.capPropio > 0 ? (nt / calc.capPropio) * 100 : 0 }
  })
}
