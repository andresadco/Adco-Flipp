import { SLabel, Card, Kpi } from '../components/ui.jsx'
import { C } from '../utils/tokens.js'
import { eur, pct } from '../App.jsx'

export default function TabEscenarios({ datos: d, calc, varPct, setVarPct, escenarios }) {
  const maxEsc = Math.max(...escenarios.map(e => Math.abs(e.neta)), 1)
  const roiColor = calc.roi >= 20 ? C.green : calc.roi >= 10 ? C.amber : calc.roi >= 0 ? C.gray : C.red

  return (
    <>
      <SLabel>Simulación de Precio de Venta</SLabel>
      <p style={{ fontSize: 13, color: C.gray, margin: '0 0 18px', lineHeight: 1.6 }}>
        Mueve el slider para simular diferentes precios de venta y ver el impacto en rentabilidad.
      </p>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 13, color: C.gray, fontWeight: 500 }}>Variación del precio de venta</span>
          <div style={{ background: varPct >= 0 ? C.greenSoft : C.redSoft, borderRadius: 8, padding: '4px 14px' }}>
            <span style={{ fontSize: 17, fontWeight: 800, color: varPct >= 0 ? C.green : C.red }}>
              {varPct > 0 ? '+' : ''}{varPct}%
            </span>
          </div>
        </div>
        <input type="range" min={-30} max={30} step={1} value={varPct}
          onChange={e => setVarPct(Number(e.target.value))}
          style={{ width: '100%', accentColor: C.blue, cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>
          <span>−30%</span><span>Base</span><span>+30%</span>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <Kpi label="Precio ajustado" value={eur(calc.ventaAdj)}  color={C.blue} />
        <Kpi label="Ganancia neta"   value={eur(calc.neta)}      color={calc.neta >= 0 ? C.green : C.red} />
        <Kpi label="ROI resultante"  value={pct(calc.roi)}       color={roiColor} />
        <Kpi label="IRPF estimado"   value={eur(calc.tax)}       color={C.gray} />
      </div>

      <SLabel>Tabla de Escenarios</SLabel>
      <Card noPad>
        <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 1fr 58px', padding: '10px 16px', background: C.bg, gap: 8, borderRadius: '14px 14px 0 0' }}>
          {['Var.', 'Precio venta', 'Ganancia neta', 'ROI'].map(h => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.gray }}>{h}</span>
          ))}
        </div>
        {escenarios.map(e => (
          <div key={e.v} style={{
            display: 'grid', gridTemplateColumns: '50px 1fr 1fr 58px',
            padding: '13px 16px', borderBottom: `1px solid ${C.bg}`, gap: 8,
            background: e.v === 0 ? C.blueSoft : C.white,
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: e.v > 0 ? C.green : e.v < 0 ? C.red : C.blue }}>
              {e.v > 0 ? '+' : ''}{e.v}%
            </span>
            <span style={{ fontSize: 12, color: C.gray }}>{eur(e.venta)}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: e.neta >= 0 ? C.green : C.red }}>{eur(e.neta)}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: e.roi >= 20 ? C.green : e.roi >= 10 ? C.amber : e.roi >= 0 ? C.gray : C.red }}>
              {pct(e.roi)}
            </span>
          </div>
        ))}
      </Card>

      <SLabel>Gráfico de Ganancia</SLabel>
      <Card>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 130, paddingTop: 8 }}>
          {escenarios.map(e => {
            const h = Math.max((Math.abs(e.neta) / maxEsc) * 105, 5)
            const isPos = e.neta >= 0
            return (
              <div key={e.v} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: isPos ? C.green : C.red, textAlign: 'center', lineHeight: 1.2 }}>
                  {eur(e.neta).replace(' €', '€')}
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                  <div style={{
                    width: '75%', height: h,
                    borderRadius: '5px 5px 0 0',
                    background: isPos ? `${C.green}BB` : `${C.red}BB`,
                    border: e.v === 0 ? `2px solid ${C.blue}` : 'none',
                    boxSizing: 'border-box',
                    transition: 'height 0.4s ease',
                    minHeight: 5,
                  }} />
                </div>
                <div style={{ fontSize: 10, color: C.gray, fontWeight: 600 }}>{e.v > 0 ? '+' : ''}{e.v}%</div>
              </div>
            )
          })}
        </div>
        <div style={{ height: 2, background: C.black, borderRadius: 1, marginTop: 6 }} />
      </Card>

      {/* Break-even */}
      <div style={{ background: C.black, borderRadius: 14, padding: '20px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          Punto de Equilibrio (Break-even)
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, color: C.white, letterSpacing: '-0.02em' }}>{eur(calc.breakEven)}</div>
        <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Precio mínimo de venta para no perder dinero</div>
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>Tu precio vs break-even</span>
          <div style={{ background: d.pVenta >= calc.breakEven ? 'rgba(21,128,61,0.2)' : 'rgba(220,38,38,0.2)', borderRadius: 8, padding: '4px 14px' }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: d.pVenta >= calc.breakEven ? C.green : C.red }}>
              {d.pVenta >= calc.breakEven ? '+' : ''}{eur(d.pVenta - calc.breakEven)}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
