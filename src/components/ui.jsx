import { useState } from 'react'
import { C } from '../utils/tokens.js'

export function Field({ label, value, onChange, min = 0, max, step = 1, unit, hint }) {
  const [local, setLocal] = useState(String(value))
  const [focused, setFocused] = useState(false)

  if (!focused && String(value) !== local) setLocal(String(value))

  const commit = (raw) => {
    const n = parseFloat(raw)
    if (isNaN(n)) { setLocal(String(value)); return }
    const clamped = max !== undefined ? Math.min(Math.max(n, min), max) : Math.max(n, min)
    onChange(clamped)
    setLocal(String(clamped))
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: C.gray, marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="number"
          value={local}
          min={min} max={max} step={step}
          onChange={e => setLocal(e.target.value)}
          onFocus={e => { setFocused(true); e.target.select() }}
          onBlur={e => { setFocused(false); commit(e.target.value) }}
          onKeyDown={e => e.key === 'Enter' && commit(local)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: unit ? '12px 52px 12px 14px' : '12px 14px',
            background: focused ? C.white : C.bg,
            border: `1.5px solid ${focused ? C.blue : C.grayLt}`,
            borderRadius: 10, fontSize: 15, fontWeight: 600,
            color: C.black, fontFamily: 'inherit', outline: 'none',
            transition: 'border-color 0.15s, background 0.15s',
          }}
        />
        {unit && (
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 12, fontWeight: 600, color: C.gray, pointerEvents: 'none' }}>
            {unit}
          </span>
        )}
      </div>
      {hint && <p style={{ margin: '5px 0 0 2px', fontSize: 11, color: '#9CA3AF', lineHeight: 1.4 }}>{hint}</p>}
    </div>
  )
}

export function Sel({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: C.gray, marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '12px 40px 12px 14px', background: C.bg,
            border: `1.5px solid ${C.grayLt}`, borderRadius: 10,
            fontSize: 15, fontWeight: 600, color: C.black,
            fontFamily: 'inherit', outline: 'none', cursor: 'pointer', appearance: 'none',
          }}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth={2.5}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  )
}

export function Card({ children, accent, noPad, style: extra }) {
  return (
    <div style={{
      background: C.white, borderRadius: 14,
      border: `1px solid ${C.grayLt}`,
      borderTop: accent ? `3px solid ${accent}` : `1px solid ${C.grayLt}`,
      padding: noPad ? 0 : '18px',
      boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      marginBottom: 14,
      overflow: noPad ? 'hidden' : undefined,
      ...extra,
    }}>
      {children}
    </div>
  )
}

export function Kpi({ label, value, sub, color, small }) {
  return (
    <Card accent={color} style={{ flex: 1, minWidth: 120, marginBottom: 0 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gray }}>{label}</div>
      <div style={{ fontSize: small ? 20 : 26, fontWeight: 800, color: color || C.black, letterSpacing: '-0.03em', margin: '7px 0 4px', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.gray }}>{sub}</div>}
    </Card>
  )
}

export function SLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '22px 0 14px' }}>
      <div style={{ width: 3, height: 16, background: C.blue, borderRadius: 2 }} />
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.black }}>{children}</span>
    </div>
  )
}

export function Toggle2({ value, onChange, a, b }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
      {[false, true].map(v => (
        <button key={String(v)} onClick={() => onChange(v)} style={{
          flex: 1, padding: '12px', borderRadius: 10,
          border: `1.5px solid ${value === v ? C.blue : C.grayLt}`,
          background: value === v ? C.blueSoft : C.white,
          color: value === v ? C.blue : C.gray,
          fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 0.15s',
        }}>
          {v ? b : a}
        </button>
      ))}
    </div>
  )
}

export function RowBar({ label, value, total, color }) {
  const w = total > 0 ? Math.min((Math.abs(value) / total) * 100, 100) : 0
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: C.gray }}>{label}</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color }}>{fmt(value)}</span>
          <span style={{ fontSize: 11, color: '#9CA3AF', minWidth: 30, textAlign: 'right' }}>{w.toFixed(0)}%</span>
        </div>
      </div>
      <div style={{ height: 6, background: C.grayLt, borderRadius: 3 }}>
        <div style={{ height: '100%', width: w + '%', background: color, borderRadius: 3, transition: 'width 0.5s' }} />
      </div>
    </div>
  )
}

export function TableRow({ label, value, type }) {
  const colorMap = { neg: C.red, green: C.green, blue: C.blue, bold: C.black, finGreen: C.green, finRed: C.red }
  const color = colorMap[type] || C.black
  const isTotal = type === 'bold' || type === 'finGreen' || type === 'finRed'
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '11px 18px',
      background: type === 'finGreen' ? C.greenSoft : type === 'finRed' ? C.redSoft : type === 'bold' ? '#F8F9FA' : C.white,
      borderBottom: `1px solid ${C.bg}`,
    }}>
      <span style={{ fontSize: 12, color: isTotal ? C.black : C.gray, fontWeight: isTotal ? 700 : 400 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color }}>
        {type === 'neg' ? '−' : ''}{fmt(Math.abs(value))}
      </span>
    </div>
  )
}

export function DarkBox({ children }) {
  return (
    <div style={{ background: C.black, borderRadius: 14, padding: '20px', marginTop: 4 }}>
      {children}
    </div>
  )
}

function fmt(n) {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return (abs / 1_000_000).toFixed(2) + 'M €'
  return Math.round(abs).toLocaleString('es-ES') + ' €'
}
