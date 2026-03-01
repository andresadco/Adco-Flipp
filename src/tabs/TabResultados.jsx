import { SLabel, Card, Kpi, RowBar, TableRow } from '../components/ui.jsx'
import { ZONAS } from '../utils/mercado.js'
import { C } from '../utils/tokens.js'
import { eur, pct } from '../App.jsx'

export default function TabResultados({ datos: d, calc, onExportPDF, exportando }) {
  const m2Mercado = ZONAS[d.zona]?.m2 || 5000
  const roiColor = calc.roi >= 20 ? C.green : calc.roi >= 10 ? C.amber : calc.roi >= 0 ? C.gray : C.red
  const tirColor = calc.tir >= 15 ? C.green : calc.tir >= 8 ? C.amber : C.red

  return (
    <>
      {/* Botón exportar PDF prominente */}
      <button
        onClick={onExportPDF}
        disabled={exportando}
        style={{
          width: '100%', padding: '14px', marginBottom: 20,
          background: exportando ? C.grayLt : C.black,
          border: 'none', borderRadius: 12,
          color: exportando ? C.gray : C.white,
          fontWeight: 700, fontSize: 14, cursor: exportando ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: exportando ? 'none' : '0 4px 14px rgba(0,0,0,0.15)',
          transition: 'all 0.2s',
        }}
      >
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        {exportando ? 'Generando PDF...' : 'Exportar Reporte PDF Profesional'}
      </button>

      <SLabel>Métricas Clave</SLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <Kpi label="ROI Neto"      value={pct(calc.roi)}  sub="Sobre capital propio"                    color={roiColor} />
        <Kpi label="TIR Anual"     value={pct(calc.tir)}  sub={`En ${d.plazo} año${d.plazo !== 1 ? 's' : ''}`} color={tirColor} />
        <Kpi label="Ganancia Neta" value={eur(calc.neta)} sub="Después de IRPF"                         color={calc.neta >= 0 ? C.green : C.red} />
        <Kpi label="Múltiplo"      value={calc.multiple.toFixed(2) + 'x'} sub="Retorno sobre capital"  color={C.blue} />
      </div>

      {/* IRPF */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.08em' }}>IRPF estimado (escala 2025)</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.red, marginTop: 6 }}>{eur(calc.tax)}</div>
          </div>
          <div style={{ fontSize: 12, color: C.gray, maxWidth: 160, textAlign: 'right', lineHeight: 1.5 }}>
            19–26% según tramo.<br/>Consulta con tu asesor fiscal.
          </div>
        </div>
      </Card>

      {/* Precio sugerido */}
      <Card style={{ background: C.blueSoft, border: `1px solid ${C.blue}25` }}>
        <div style={{ fontSize: 11, color: C.blue, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          💡 Para alcanzar ROI del 20%
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.blue, letterSpacing: '-0.02em' }}>{eur(calc.sug20)}</div>
            <div style={{ fontSize: 12, color: C.gray, marginTop: 4 }}>= {Math.round(calc.sug20 / d.m2Total).toLocaleString('es-ES')} €/m²</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12, color: C.gray }}>
            Mercado {d.zona}:<br /><strong style={{ color: C.black }}>{m2Mercado.toLocaleString('es-ES')} €/m²</strong>
          </div>
        </div>
        <div style={{ height: 8, background: C.grayLt, borderRadius: 4, overflow: 'hidden', marginTop: 14 }}>
          <div style={{ height: '100%', width: Math.min((calc.m2Venta / (m2Mercado * 1.4)) * 100, 100) + '%', background: `linear-gradient(90deg,${C.blue},${C.green})`, borderRadius: 4, transition: 'width 0.5s' }} />
        </div>
        <div style={{ fontSize: 11, color: C.gray, marginTop: 6 }}>
          Tu precio actual: {Math.round(calc.m2Venta).toLocaleString('es-ES')} €/m²
        </div>
      </Card>

      <SLabel>Desglose de Inversión</SLabel>
      <Card>
        <RowBar label="Precio de compra"    value={d.pCompra}       total={calc.invTotal} color={C.blue} />
        <RowBar label="Gastos de compra"    value={calc.gcCompra}   total={calc.invTotal} color="#7C3AED" />
        <RowBar label="Reforma (IVA incl.)" value={calc.reforma}    total={calc.invTotal} color={C.amber} />
        {d.useFin && <RowBar label="Intereses préstamo" value={calc.intereses} total={calc.invTotal} color={C.red} />}
      </Card>

      <SLabel>Resumen Ejecutivo</SLabel>
      <Card noPad>
        <div style={{ background: C.black, padding: '14px 18px', borderRadius: '14px 14px 0 0' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9CA3AF' }}>
            {d.nombre} · {d.zona}
          </div>
        </div>
        <TableRow label="Precio de compra"     value={d.pCompra}       type="normal" />
        <TableRow label="Gastos de compra"     value={calc.gcCompra}   type="neg"    />
        <TableRow label="Reforma (IVA incl.)"  value={calc.reforma}    type="neg"    />
        <TableRow label="Inversión total"      value={calc.invTotal}   type="bold"   />
        {d.useFin && <TableRow label="Préstamo bancario"   value={calc.prestamo}  type="blue"  />}
        {d.useFin && <TableRow label="Capital propio"      value={calc.capPropio} type="green" />}
        {d.useFin && <TableRow label="Intereses préstamo"  value={calc.intereses} type="neg"   />}
        <TableRow label="Precio de venta"      value={calc.ventaAdj}   type="normal" />
        <TableRow label="Comisión de venta"    value={calc.gcVenta}    type="neg"    />
        <TableRow label="Ganancia bruta"       value={calc.bruta}      type={calc.bruta >= 0 ? 'green' : 'neg'} />
        <TableRow label="IRPF estimado"        value={calc.tax}        type="neg"    />
        <TableRow label="Ganancia neta"        value={calc.neta}       type={calc.neta >= 0 ? 'finGreen' : 'finRed'} />
      </Card>

      {/* Segundo botón PDF al fondo */}
      <button
        onClick={onExportPDF}
        disabled={exportando}
        style={{
          width: '100%', padding: '12px', marginTop: 4,
          background: C.white, border: `1.5px solid ${C.grayLt}`,
          borderRadius: 12, color: C.gray,
          fontWeight: 600, fontSize: 13, cursor: 'pointer',
          fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        ↓ Descargar reporte completo en PDF
      </button>
    </>
  )
}
