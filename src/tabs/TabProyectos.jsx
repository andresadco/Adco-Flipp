import { C } from '../utils/tokens.js'
import { eur, pct } from '../App.jsx'

export default function TabProyectos({ proyectos, onCargar, onEliminar }) {
  if (proyectos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📁</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.black, marginBottom: 8 }}>Sin proyectos guardados</div>
        <div style={{ fontSize: 14, color: C.gray, lineHeight: 1.6 }}>
          Configura un proyecto y pulsa <strong>"+ Guardar"</strong> en la cabecera para guardarlo aquí.
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.black }}>Proyectos guardados</div>
        <div style={{ fontSize: 12, color: C.gray }}>{proyectos.length} / 10</div>
      </div>

      {proyectos.map(p => {
        const roiColor = p.resultado.roi >= 20 ? C.green : p.resultado.roi >= 10 ? C.amber : p.resultado.roi >= 0 ? C.gray : C.red
        return (
          <div key={p.id} style={{
            background: C.white, borderRadius: 14, border: `1px solid ${C.grayLt}`,
            padding: '16px 18px', marginBottom: 12,
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.black }}>{p.datos.nombre}</div>
                <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>{p.datos.zona} · {p.fecha}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>ROI</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: roiColor }}>{pct(p.resultado.roi)}</div>
              </div>
            </div>

            {/* Métricas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
              {[
                ['Inversión', eur(p.resultado.invTotal), C.black],
                ['Ganancia', eur(p.resultado.neta), p.resultado.neta >= 0 ? C.green : C.red],
                ['TIR', pct(p.resultado.tir), C.blue],
              ].map(([l, v, co]) => (
                <div key={l} style={{ background: C.bg, borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 10, color: C.gray, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: co }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => onCargar(p)}
                style={{ flex: 1, padding: '10px', background: C.blue, border: 'none', borderRadius: 8, color: C.white, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Cargar proyecto
              </button>
              <button
                onClick={() => { if (window.confirm(`¿Eliminar "${p.datos.nombre}"?`)) onEliminar(p.id) }}
                style={{ padding: '10px 14px', background: C.redSoft, border: `1px solid ${C.red}30`, borderRadius: 8, color: C.red, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                🗑
              </button>
            </div>
          </div>
        )
      })}

      <div style={{ background: C.blueSoft, border: `1px solid ${C.blue}25`, borderRadius: 12, padding: '14px 16px', marginTop: 8 }}>
        <div style={{ fontSize: 12, color: C.blue, fontWeight: 600 }}>
          ℹ️ Los proyectos se guardan en esta sesión. Para guardarlos permanentemente, exporta el proyecto desde la pestaña Resultados.
        </div>
      </div>
    </>
  )
}
