import { Field, SLabel, Card, Toggle2, DarkBox } from '../components/ui.jsx'
import { ZONAS } from '../utils/mercado.js'
import { C } from '../utils/tokens.js'
import { eur } from '../App.jsx'

export default function TabFinanciacion({ datos: d, set, calc }) {
  const m2Mercado = ZONAS[d.zona]?.m2 || 5000
  const diffPct = m2Mercado > 0 ? ((calc.m2Venta / m2Mercado) * 100).toFixed(0) : 0
  const barW = Math.min((calc.m2Venta / (m2Mercado * 1.4)) * 100, 100)

  return (
    <>
      <SLabel>Precio de Venta</SLabel>
      <Field label="Precio de venta esperado" value={d.pVenta} onChange={set('pVenta')} min={0} step={5000} unit="€" />
      <Field label="Comisión agencia de venta" value={d.comVenta} onChange={set('comVenta')} min={0} max={10} step={0.5} unit="%" />

      {/* m² vs mercado */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: C.gray, fontWeight: 600, marginBottom: 4 }}>Tu precio/m²</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: calc.m2Venta >= m2Mercado * 0.9 ? C.green : C.amber }}>
              {Math.round(calc.m2Venta).toLocaleString('es-ES')} €/m²
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: C.gray, fontWeight: 600, marginBottom: 4 }}>Mercado {d.zona}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.gray }}>{m2Mercado.toLocaleString('es-ES')} €/m²</div>
          </div>
        </div>
        <div style={{ height: 8, background: C.grayLt, borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ height: '100%', width: barW + '%', background: `linear-gradient(90deg,${C.blue},${C.green})`, borderRadius: 4, transition: 'width 0.5s' }} />
        </div>
        <div style={{ fontSize: 12, color: C.gray }}>
          Tu precio representa el <strong style={{ color: C.blue }}>{diffPct}%</strong> del precio de mercado en {d.zona}
        </div>
      </Card>

      <SLabel>Financiación Bancaria</SLabel>
      <Toggle2 value={d.useFin} onChange={set('useFin')} a="Sin préstamo" b="Con préstamo" />

      {d.useFin ? (
        <Card>
          <div style={{ fontSize: 12, color: C.gray, marginBottom: 16 }}>
            Financiación sobre la inversión total de <strong style={{ color: C.black }}>{eur(calc.invTotal)}</strong>
          </div>
          <Field label="% financiado por el banco" value={d.pctPrest} onChange={set('pctPrest')} min={0} max={90} step={5} unit="%"
            hint="LTV habitual en España: 60-70% para inversión" />
          <Field label="Tipo de interés anual"     value={d.tasaInt}  onChange={set('tasaInt')}  min={0} max={20} step={0.25} unit="%" />
          <Field label="Plazo del préstamo"         value={d.plazo}    onChange={set('plazo')}    min={0.5} max={5} step={0.5} unit="años" />

          <div style={{ borderTop: `1px solid ${C.grayLt}`, paddingTop: 16, marginTop: 4 }}>
            {[
              ['Préstamo solicitado', eur(calc.prestamo),  C.blue,  false],
              ['Intereses totales',   eur(calc.intereses), C.red,   false],
              ['Capital propio necesario', eur(calc.capPropio), C.green, true],
            ].map(([l, v, co, bold]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: bold ? C.black : C.gray, fontWeight: bold ? 700 : 400 }}>{l}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: co }}>{v}</span>
              </div>
            ))}
          </div>

          {/* LTV indicator */}
          <div style={{ background: C.bg, borderRadius: 8, padding: '10px 14px', marginTop: 4 }}>
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 6 }}>LTV (Loan to Value)</div>
            <div style={{ height: 6, background: C.grayLt, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: d.pctPrest + '%', background: d.pctPrest > 75 ? C.red : d.pctPrest > 65 ? C.amber : C.green, borderRadius: 3, transition: 'width 0.5s' }} />
            </div>
            <div style={{ fontSize: 11, color: C.gray, marginTop: 6 }}>
              {d.pctPrest}% — {d.pctPrest <= 65 ? '✅ Conservador' : d.pctPrest <= 75 ? '⚠️ Moderado' : '🔴 Elevado'}
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div style={{ fontSize: 12, color: C.gray, marginBottom: 8 }}>
            Sin financiación — necesitas el 100% de la inversión en capital propio
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.black, letterSpacing: '-0.02em' }}>{eur(calc.invTotal)}</div>
          <div style={{ fontSize: 12, color: C.gray, marginTop: 6 }}>
            Ventaja: sin intereses ni deuda. Toda la ganancia es tuya.
          </div>
        </Card>
      )}

      {/* Resumen rápido */}
      <DarkBox>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Resumen de la Operación</div>
        {[
          ['Inversión total',      eur(calc.invTotal),  C.white],
          ['Capital propio',       eur(calc.capPropio), C.blue],
          ['Precio de venta',      eur(d.pVenta),       C.white],
          ['Ganancia neta estimada', eur(calc.neta),    calc.neta >= 0 ? C.green : C.red],
        ].map(([l, v, co]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>{l}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: co }}>{v}</span>
          </div>
        ))}
      </DarkBox>
    </>
  )
}
