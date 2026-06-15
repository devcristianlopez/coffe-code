# ☕ Coffee Companion

App web progresiva (PWA) para guiarte paso a paso en la preparación de café con métodos como **V60**, **Chemex**, **Prensa Francesa**, **Moka**, **Aeropress** y **Espresso**. Ideal para usar mientras te hacés el café: timer interactivo, modo manos libres, calculadora de ratios y registro de catas.

> 🚀 **Live demo:** https://anarcha0s.github.io/coffe-code/

---

## ✨ Funcionalidades

### ⏱️ Timer paso a paso
Seleccionás una receta y la app te guía con un temporizador para cada paso:
- Bloom, vertidos, inmersión, presión — cada acción con su tiempo exacto
- Avance automático al siguiente paso
- Sonido al cambiar de paso (Web Audio API)
- Vista previa de todos los pasos antes de empezar

### 🖐️ Modo manos libres
Cuando estás con las manos ocupadas preparando café:
- Pantalla completa (fullscreen API)
- Timer gigante que ocupa el 60% de la pantalla
- Instrucciones en texto enorme
- Controles que se auto-ocultan tras 3s
- **Doble tap** en la pantalla para avanzar al siguiente paso
- Botones touch de 64px+ para usar con los nudillos

### 🧮 Calculadora de ratios
Calculá la receta perfecta:
- Seleccionás método, gramos de café y ratio (1:15, 1:16, 1:16.7, etc.)
- Calcula automáticamente: agua total, agua de bloom, temperatura sugerida, tiempo estimado
- Botón "Guardar como receta" para crear una receta nueva con esos valores

### 📖 Gestión de recetas
- **8 recetas precargadas** de especialistas como James Hoffmann y Tetsu Kasuya
- Creá tus propias recetas con pasos personalizados
- Editá y eliminá recetas (las precargadas son de solo lectura)
- Cada receta incluye: gramos, temperatura, molienda, ratio y pasos detallados
- Orden de pasos ajustable (subir/bajar)

### 📝 Notas de cata
Después de cada preparación:
- Rating de 1 a 5 ⭐
- Notas de sabor (afrutado, chocolate, cuerpo, acidez...)
- Ajustes realizados respecto a la receta original
- Todo queda guardado en el historial

### 📋 Historial de preparaciones
- Registro cronológico de todas tus preparaciones
- Filtros por método (V60, Chemex, etc.) y período (7 días, mes, todos)
- Detalle expandible con notas completas
- Exportación de datos completa

### ⚙️ Configuración personalizada
- **Defaults por método**: temperatura y ratio favorito para cada método
- **Unidades**: gramos/onzas, °C/°F
- **Sonido**: toggle ON/OFF y volumen
- **Exportar/Importar datos**: backup completo en JSON de recetas e historial
- **Borrar datos** con doble confirmación

---

## 📱 PWA (Progressive Web App)

La app es totalmente instalable en tu celular o desktop:

1. Abrí `https://anarcha0s.github.io/coffe-code/` en Chrome/Edge/Safari
2. En Android: tocá "Instalar" en el banner o menú
3. En iOS: tocá "Compartir" → "Agregar a pantalla de inicio"
4. En Desktop: click en el ícono de instalación en la barra de direcciones

**Características PWA:**
- ✅ Funciona **offline** después de la primera carga
- ✅ Pantalla completa sin navegador (standalone)
- ✅ Orientación portrait bloqueada
- ✅ Tema café (#6F4E37) en la barra de estado
- ✅ Actualización automática del service worker

---

## 🗺️ Rutas de la app

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Home | Selector de métodos de café |
| `/recipes/:method` | Recetas | Lista de recetas por método |
| `/recipes/:method/:id` | Detalle | Receta completa con pasos |
| `/recipes/new?method=` | Nueva receta | Formulario de creación |
| `/recipes/:method/:id/edit` | Editar | Editar receta existente |
| `/brew/:recipeId` | Preparación | ⭐ Timer + modo manos libres |
| `/calculator` | Calculadora | Ratios café/agua |
| `/history` | Historial | Registro de catas |
| `/settings` | Configuración | Preferencias y datos |

---

## 🧱 Stack técnico

| Capa | Tecnología |
|------|-----------|
| **Framework** | [React 19](https://react.dev/) |
| **Lenguaje** | [TypeScript 5.8](https://www.typescriptlang.org/) (strict mode) |
| **Build** | [Vite 8](https://vite.dev/) |
| **Estilos** | [Tailwind CSS 4](https://tailwindcss.com/) (vía `@tailwindcss/vite`) |
| **Estado** | [Zustand](https://github.com/pmndrs/zustand) + `persist` middleware |
| **Base de datos** | [Dexie.js](https://dexie.org/) (IndexedDB) |
| **Router** | [React Router 7](https://reactrouter.com/) |
| **PWA** | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) |
| **Deploy** | GitHub Actions → GitHub Pages |

### Estructura del proyecto

```
coffe-code/
├── .github/workflows/deploy.yml   # GitHub Actions deploy
├── public/
│   ├── favicon.svg
│   └── icons/coffee-icon.svg      # Icono PWA
├── src/
│   ├── types/index.ts             # Tipos: Recipe, BrewStep, BrewLog
│   ├── db/index.ts                # Dexie (IndexedDB)
│   ├── data/recipes.ts            # 8 recetas precargadas
│   ├── hooks/
│   │   ├── useTimer.ts            # Timer con pasos y sonidos
│   │   ├── useRecipes.ts          # CRUD de recetas
│   │   ├── useBrewHistory.ts      # Historial de preparaciones
│   │   └── useSettings.ts         # Config persistente
│   ├── stores/uiStore.ts          # Estado de UI (manos libres)
│   ├── lib/calculations.ts        # Ratio, bloom, temp, formatos
│   ├── components/
│   │   ├── Layout.tsx             # Header + BottomNav
│   │   ├── BrewTimer.tsx          # Timer visual
│   │   ├── BrewStepCard.tsx       # Paso actual
│   │   ├── RecipeTimerSummary.tsx # Resumen de tiempos
│   │   └── TastingNotesForm.tsx   # Formulario de cata
│   ├── pages/
│   │   ├── HomePage.tsx           # Selector de métodos
│   │   ├── RecipesPage.tsx        # Lista de recetas
│   │   ├── RecipeDetailPage.tsx   # Detalle de receta
│   │   ├── RecipeFormPage.tsx     # Crear/editar receta
│   │   ├── BrewPage.tsx           # Timer + manos libres ⭐
│   │   ├── CalculatorPage.tsx     # Calculadora de ratio
│   │   ├── HistoryPage.tsx        # Historial de catas
│   │   └── SettingsPage.tsx       # Configuración
│   ├── App.tsx                    # Router principal
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Tailwind + paleta café
├── vite.config.ts                 # Config Vite + PWA
├── package.json
└── tsconfig.json
```

---

## 📦 Recetas precargadas

| Método | Receta | Autor | Café | Agua | Ratio |
|--------|--------|-------|------|------|-------|
| V60 | Clásico | James Hoffmann | 15g | 250g | 1:16.7 |
| V60 | 4:6 | Tetsu Kasuya | 20g | 300g | 1:15 |
| Chemex | Clásico | James Hoffmann | 30g | 500g | 1:16.7 |
| Prensa Francesa | Clásico | James Hoffmann | 30g | 500g | 1:16.7 |
| Moka | Clásica Italiana | — | 18g | 180g | 1:10 |
| Aeropress | Clásico | — | 14g | 200g | 1:14.3 |
| Aeropress | Campeón Mundial 2023 | — | 18g | 200g | 1:11.1 |
| Espresso | Clásico 1:2 | — | 18g | 36g | 1:2 |

---

## 🔧 Desarrollo local

```bash
# Clonar
git clone https://github.com/anarcha0s/coffe-code.git
cd coffe-code

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (http://localhost:5173)
npm run dev
```

### Comandos útiles

```bash
npm run dev       # Servidor de desarrollo con HMR
npm run build     # Build para producción → dist/
npm run preview   # Vista previa del build
npx tsc --noEmit  # Verificar tipos sin emitir
```

---

## 🚀 Deploy a GitHub Pages

El deploy es automático mediante GitHub Actions:

1. Pusheá a la rama `main`:
   ```bash
   git push origin main
   ```

2. El workflow en `.github/workflows/deploy.yml` se ejecuta automáticamente:
   - Build con `npm run build`
   - Sube el directorio `dist/` como artifact
   - Deploya a GitHub Pages

3. También se puede disparar manualmente desde:
   **Actions → Deploy to GitHub Pages → Run workflow**

4. La app queda disponible en:
   `https://TU_USUARIO.github.io/coffe-code/`

> ⚠️ Si el nombre de tu repo es diferente a `coffe-code`, actualizá el `base` en `vite.config.ts`.

### Configurar GitHub Pages por primera vez

1. Ir a **Settings → Pages** del repositorio en GitHub
2. En **Source**, seleccionar **GitHub Actions**
3. Listo — el próximo push a `main` hace el deploy automático

---

## 🎨 Paleta de colores

La app usa una paleta de tonos café personalizada definida con Tailwind CSS v4:

| Variable | Color | Uso |
|----------|-------|-----|
| `--color-coffee-primary` | `#6F4E37` | Botones, headers, acentos |
| `--color-coffee-primary-light` | `#A0765A` | Hover, variantes claras |
| `--color-coffee-bg` | `#FFF8F0` | Fondo principal (crema) |
| `--color-coffee-text` | `#2C1810` | Texto principal (café oscuro) |
| `--color-coffee-muted` | `#8B7355` | Texto secundario |

---

## 📄 Licencia

MIT — hacé lo que quieras con el código.
