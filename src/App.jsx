import { useState, useMemo, useCallback } from 'react'
import TabProyecto from './tabs/TabProyecto.jsx'
import TabFinanciacion from './tabs/TabFinanciacion.jsx'
import TabResultados from './tabs/TabResultados.jsx'
import TabEscenarios from './tabs/TabEscenarios.jsx'
import TabProyectos from './tabs/TabProyectos.jsx'
import { calcular, calcularEscenarios } from './utils/calcular.js'
import { exportarPDF } from './utils/exportPDF.js'
import { C } from './utils/tokens.js'

export const TABS = [
  { id: 'proyecto',     label: 'Proyecto',    icon: '📐' },
  { id: 'financiacion', label: 'Financiación', icon: '🏦' },
  { id: 'resultados',   label: 'Resultados',   icon: '📊' },
  { id: 'escenarios',   label: 'Escenarios',   icon: '🔭' },
  { id: 'guardados',    label: 'Guardados',    icon: '📁' },
]

const DEFAULT = {
  nombre:    'Proyecto sin nombre',
  zona:      'Chamberí',
  m2Total:   100,
  m2Reform:  90,
  costM2:    800,
  costExtra: 5000,
  ivaRef:    10,
  pCompra:   350000,
  comCompra: 0,
  gLeg:      3000,
  gAdm:      3000,
  itp:       6,
  ibi:       1000,
  pVenta:    550000,
  comVenta:  3,
  useFin:    false,
  pctPrest:  70,
  tasaInt:   4.5,
  plazo:     1,
}

export default function App() {
  const [tab, setTab]         = useState(0)
  const [datos, setDatos]     = useState(DEFAULT)
  const [proyectos, setProyectos] = useState([])
  const [varPct, setVarPct]   = useState(0)
  const [exportando, setExportando] = useState(false)

  const set = useCallback((key) => (val) => setDatos(d => ({ ...d, [key]: val })), [])
  const calc = useMemo(() => calcular(datos, varPct), [datos, varPct])
  const escenarios = useMemo(() => calcularEscenarios(datos, calc), [datos, calc])

  const guardarProyecto = () => {
    const nuevo = { id: Date.now(), fecha: new Date().toLocaleDateString('es-ES'), datos: { ...datos }, resultado: { ...calc } }
    setProyectos(prev => [nuevo, ...prev.slice(0, 9)])
    alert(`✅ "${datos.nombre}" guardado`)
  }

  const handleExportPDF = async () => {
    setExportando(true)
    try {
      await exportarPDF(datos, calc, escenarios)
    } catch (e) {
      alert('Error al generar PDF: ' + e.message)
    } finally {
      setExportando(false)
    }
  }

  const roiColor = calc.roi >= 20 ? C.green : calc.roi >= 10 ? C.amber : calc.roi >= 0 ? C.gray : C.red

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: 600, margin: '0 auto', paddingBottom: 80 }}>

      {/* ── HEADER ── */}
      <header style={{ background: C.black, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
        <div style={{ padding: '16px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke={C.blue} strokeWidth="2"/>
              <circle cx="16" cy="16" r="9"  stroke={C.blue} strokeWidth="1.5" strokeDasharray="3 2"/>
              <circle cx="16" cy="16" r="4"  fill={C.blue}/>
            </svg>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.white, letterSpacing: '0.06em' }}>ADCO</div>
              <div style={{ fontSize: 8, color: C.blue, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>Investments</div>
            </div>
          </div>

          {/* Acciones + ROI */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={handleExportPDF} disabled={exportando} style={{
              background: exportando ? '#374151' : C.blue, border: 'none', borderRadius: 8,
              padding: '7px 12px', color: C.white, fontWeight: 700, fontSize: 11,
              cursor: exportando ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
            }}>
              {exportando ? '⏳ PDF...' : '↓ PDF'}
            </button>
            <button onClick={guardarProyecto} style={{
              background: 'rgba(71,148,215,0.15)', border: `1px solid ${C.blue}50`, borderRadius: 8,
              padding: '7px 12px', color: C.blue, fontWeight: 700, fontSize: 11,
              cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}>
              + Guardar
            </button>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 8, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>ROI</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: roiColor, letterSpacing: '-0.03em', lineHeight: 1 }}>{pct(calc.roi)}</div>
              <div style={{ fontSize: 9, color: '#9CA3AF' }}>{eur(calc.neta)}</div>
            </div>
          </div>
        </div>

        {/* Nombre del proyecto */}
        <div style={{ padding: '10px 16px 0' }}>
          <input
            value={datos.nombre}
            onChange={e => set('nombre')(e.target.value)}
            placeholder="Nombre del proyecto..."
            style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '7px 12px', color: C.white, fontSize: 13, fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', outline: 'none', fontWeight: 500 }}
          />
        </div>

        {/* Tabs */}
        <nav style={{ display: 'flex', marginTop: 10, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {TABS.map((t, i) => (
            <button key={t.id} onClick={() => setTab(i)} style={{
              flex: '0 0 auto', background: 'none', border: 'none',
              borderBottom: `2.5px solid ${tab === i ? C.blue : 'transparent'}`,
              padding: '9px 14px 11px',
              color: tab === i ? C.white : '#6B7280',
              fontWeight: tab === i ? 700 : 500,
              fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s', letterSpacing: '0.02em', whiteSpace: 'nowrap',
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ padding: '22px 16px' }}>
        {tab === 0 && <TabProyecto    datos={datos} set={set} calc={calc} />}
        {tab === 1 && <TabFinanciacion datos={datos} set={set} calc={calc} />}
        {tab === 2 && <TabResultados  datos={datos} calc={calc} onExportPDF={handleExportPDF} exportando={exportando} />}
        {tab === 3 && <TabEscenarios  datos={datos} calc={calc} varPct={varPct} setVarPct={setVarPct} escenarios={escenarios} />}
        {tab === 4 && <TabProyectos   proyectos={proyectos} onCargar={(p) => { setDatos(p.datos); setTab(0) }} onEliminar={(id) => setProyectos(prev => prev.filter(p => p.id !== id))} />}
      </main>
    </div>
  )
}

export function eur(n) {
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000) return sign + (abs / 1_000_000).toFixed(2) + 'M €'
  return sign + Math.round(abs).toLocaleString('es-ES') + ' €'
}
export function pct(n) {
  return isFinite(n) ? n.toFixed(1) + '%' : '—'
}
