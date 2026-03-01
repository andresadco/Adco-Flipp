# ADCO Investments · Simulador de Flipping Inmobiliario

## Deploy en Vercel (5 minutos)

### Opción A — Subir carpeta a GitHub + Vercel (recomendado)

1. Ve a [github.com](https://github.com) → New Repository → llámalo `adco-flipping`
2. Sube todos estos archivos al repo (drag & drop en la web de GitHub)
3. Ve a [vercel.com](https://vercel.com) → Add New Project
4. Conecta tu cuenta de GitHub y selecciona el repo `adco-flipping`
5. Vercel detecta Vite automáticamente → pulsa **Deploy**
6. En ~1 minuto tendrás tu URL tipo `adco-flipping.vercel.app`

### Opción B — Vercel CLI

```bash
npm install -g vercel
cd adco-flipping
npm install
vercel
```

### Desarrollo local

```bash
npm install
npm run dev
# Abre http://localhost:5173
```

## Estructura del proyecto

```
adco-flipping/
├── src/
│   ├── App.jsx              # App principal + navegación
│   ├── main.jsx             # Entry point React
│   ├── components/
│   │   └── ui.jsx           # Componentes reutilizables
│   ├── tabs/
│   │   ├── TabProyecto.jsx      # Datos del proyecto
│   │   ├── TabFinanciacion.jsx  # Venta y préstamo
│   │   ├── TabResultados.jsx    # Análisis financiero
│   │   ├── TabEscenarios.jsx    # Simulación de escenarios
│   │   └── TabProyectos.jsx     # Historial de proyectos
│   └── utils/
│       ├── calcular.js      # Motor de cálculo financiero
│       ├── mercado.js       # Precios €/m² por zona Q4 2025
│       └── tokens.js        # Paleta de colores ADCO
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## Datos de mercado

Precios €/m² basados en Fotocasa / Idealista / Tinsa Q4 2025.
Actualizar en `src/utils/mercado.js`.
