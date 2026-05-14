# skipit-ui — Component Library

Librería de componentes compartidos de Skipit. Se consume como dependencia local (`file:../skipit-ui`) en los proyectos del monorepo.

## Stack
- React 18, TypeScript estricto
- MUI v5 con `SkipitTheme`
- Build: `tsc` → `dist/`

## Brand tokens (`src/tokens/colors.ts`)
| Token | Hex | Uso |
|-------|-----|-----|
| `darkGreen` | `#062E35` | Backgrounds oscuros, headers, texto dark |
| `mint` | `#61F8A9` | Acentos, CTAs, focus rings |
| `offWhite` | `#FDFDFD` | Backgrounds claros, superficies |
| `red` | `#EF4444` | Acciones destructivas, montos negativos |

## Componentes disponibles

### Tablas
- **`DataTable`** — columnas ordenables. Usar cuando se necesita sort.
- **`SimpleTable`** — sin orden. Usar para listas estáticas.
- NUNCA crear tablas con `<table>` HTML crudo.

### Inputs numéricos
- **`NumberStepper`** — el usuario sube/baja con flechas (ej: cantidades).
- **`NumberInput`** — el usuario tipea el valor; acepta `prefix` (ej: `"$"`).
- NUNCA usar `<input type="number">` suelto.

### Acciones de fila
- **`ActionButtons`** — lápiz editar (siempre gris) + tacho eliminar.
  - `deleteConfirmed=true` → tacho ROJO (acción directa).
  - `deleteConfirmed=false` → tacho GRIS (requiere confirmación).

### Feedback / Estado
- **`StatusBadge`** — `status="activo|pausado|perdido"`.
- NUNCA usar texto plano ni Chip custom.

## Agregar un componente nuevo
1. Crear el archivo en la carpeta correspondiente bajo `src/components/`.
2. Exportarlo desde `src/index.ts`.
3. Documentarlo en este CLAUDE.md.

## Publicar cambios
```bash
npm run build   # compila a dist/
# los proyectos consumidores hacen npm install para recoger los cambios
```
