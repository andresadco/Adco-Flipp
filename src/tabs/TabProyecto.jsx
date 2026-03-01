import { Field, Sel, SLabel, Card, DarkBox } from '../components/ui.jsx'
import { ZONAS } from '../utils/mercado.js'
import { C } from '../utils/tokens.js'
import { eur } from '../App.jsx'

export default function TabProyecto({ datos: d, set, calc }) {
  const m2Mercado = ZONAS[d.zona]?.m2 || 5000

  return (
    <>
      <Sel label="Zona de Madrid" value={d.zona} onChange={set('zona')} options={Object.keys(ZONAS)} />

      {/* Badge mercado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.blueSoft, border: `1px solid ${C.blue}30`, borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.blue, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Mercado {d.zona}</div>
          <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>Fotocasa / Idealista Q4 2025</div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.blue }}>{m2Mercado.toLocaleString('es-ES')} €/m²</div>
      </div>

      <SLabel>Superficie</SLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Total (m²)"      value={d.m2Total}  onChange={set('m2Total')}  min={10} max={2000} unit="m²" />
        <Field label="A reformar (m²)" value={d.m2Reform} onChange={set('m2Reform')} min={0} max={d.m2Total} unit="m²" />
      </div>

      <SLabel>Reforma</SLabel>
      <Field label="Coste por m² de reforma" value={d.costM2} onChange={set('costM2')} min={100} max={6000} step={50} unit="€/m²"
        hint="Básica 400-600 · Media 700-1.000 · Premium 1.200+" />
      <Field label="Costes adicionales (honorarios, OCE...)" value={d.costExtra} onChange={set('costExtra')} min={0} step={500} unit="€" />
      <Field label="IVA en reforma" value={d.ivaRef} onChange={set('ivaRef')} min={0} max={21} step={0.5} unit="%"
        hint="Habitacional: 10% · Obra nueva: 21%" />

      <Card accent={C.blue}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Coste total reforma (IVA incluido)</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: C.blue, letterSpacing: '-0.03em' }}>{eur(calc.reforma)}</div>
        <div style={{ fontSize: 12, color: C.gray, marginTop: 4 }}>
          {eur(d.m2Reform * d.costM2 * (1 + d.ivaRef / 100))} reforma + {eur(d.costExtra)} adicionales
        </div>
      </Card>

      <SLabel>Datos de Compra</SLabel>
      <Field label="Precio de compra" value={d.pCompra} onChange={set('pCompra')} min={50000} step={5000} unit="€" />
      <Field label="Comisión de compra (agencia)" value={d.comCompra} onChange={set('comCompra')} min={0} max={10} step={0.5} unit="%" />
      <Field label="ITP / IVA de compra" value={d.itp} onChange={set('itp')} min={0} max={21} step={0.5} unit="%"
        hint="2ª mano Madrid: 6% · Obra nueva: 10%" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Gastos notaría / registro" value={d.gLeg} onChange={set('gLeg')} min={0} step={500} unit="€" />
        <Field label="Gestoría / admin."          value={d.gAdm} onChange={set('gAdm')} min={0} step={500} unit="€" />
      </div>
      <Field label="IBI anual" value={d.ibi} onChange={set('ibi')} min={0} step={100} unit="€" />

      <DarkBox>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Inversión total del proyecto</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: C.white, letterSpacing: '-0.03em', marginBottom: 14 }}>{eur(calc.invTotal)}</div>
        <div style={{ display: 'flex', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {[['Compra', d.pCompra, C.blue], ['Gastos', calc.gcCompra, '#A78BFA'], ['Reforma', calc.reforma, C.amber]].map(([l, v, co]) => (
            <div key={l} style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{l}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: co, marginTop: 3 }}>{eur(v)}</div>
            </div>
          ))}
        </div>
      </DarkBox>
    </>
  )
}
