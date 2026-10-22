# Municipal Utilities DS

Librería CSS utilitaria inspirada en Tailwind CSS, adaptada para proyectos GeneXus.

El objetivo es centralizar estilos reutilizables en un único Design System CSS para evitar repetir reglas en distintas KBs.

## Estructura del proyecto

```txt
municipal-utilities/
│
├── src/
│   ├── theme.css
│   ├── utilities.css
│   ├── components/*.css
│   └── index.css
│
├── build/
│   ├── municipal-design-system.css
│   └── municipal-design-system.min.css
│
├── docs/
│   ├── index.html
│   ├── docs.css
│   └── docs.js
│
├── scripts/
│   └── build-css.js
│
├── package.json
└── README.md
```

## Carpetas

### `src/`

Contiene los archivos editables del Design System.

- `theme.css`: variables, colores, tokens, sombras, radios, fuentes y base global.
- `utilities.css`: clases utilitarias tipo `u-flex`, `u-p-4`, `u-bg-primary`, `u-hover:bg-primary`, `u-md:hidden`.
- `components/*.css`: componentes reutilizables como `uic-btn`, `uic-card`, `uic-input`, `uic-badge`, `uic-alert`, `uic-table`.
- `index.css`: archivo de entrada que importa theme, utilities y components.

Contenido de `src/index.css`:

```css
@import url("./theme.css");

@import url("./components/buttons.css");
@import url("./components/forms.css");
@import url("./components/cards.css");
@import url("./components/alerts.css");
@import url("./components/badges.css");
@import url("./components/tables.css");
@import url("./components/empty-states.css");
@import url("./components/page-layout.css");

@import url("./utilities.css");
```

### `build/`

Contiene los archivos finales generados automáticamente.

- `municipal-design-system.css`: CSS completo sin minificar.
- `municipal-design-system.min.css`: CSS minificado para usar en GeneXus.

No editar manualmente los archivos de `build/`.

### `docs/`

Contiene la documentación web.

- `index.html`: página principal.
- `docs.css`: estilos propios de la documentación.
- `docs.js`: lógica del buscador, regiones y ejemplos.

### `scripts/`

Contiene scripts de automatización.

- `build-css.js`: compila los CSS de `src/` y genera los archivos de `build/`.

## Instalación

Instalar dependencias:

```bash
npm install
```

Si el proyecto todavía no tiene `package.json`:

```bash
npm init -y
npm install -D clean-css chokidar
```

## Scripts

En `package.json` deben existir estos scripts:

```json
"scripts": {
  "build:css": "node scripts/build-css.js",
  "watch:css": "node scripts/build-css.js --watch"
}
```

## Compilar CSS

Cada vez que se modifique algo dentro de `src/`, ejecutar:

```bash
npm run build:css
```

Esto genera:

```txt
build/municipal-design-system.css
build/municipal-design-system.min.css
```

## Modo desarrollo

Para regenerar automáticamente el `dist` al guardar cambios:

```bash
npm run watch:css
```

Este comando escucha cambios en:

```txt
src/theme.css
src/utilities.css
src/components/*.css
```

## Flujo recomendado

```txt
1. Editar archivos dentro de src/
2. Ejecutar npm run build:css
3. Probar cambios
4. Subir cambios a GitHub
5. Consumir el min.css desde GeneXus
```

## Uso en GeneXus

Desde la Master Page:

```gx
Form.HeaderRawHTML += !'<link rel="stylesheet" type="text/css" href="https://facuur001.github.io/municipal-utilities/build/municipal-design-system.min.css?v=1">'
```

El parámetro `?v=1` ayuda a evitar problemas de caché. Cuando se actualice el CSS se puede cambiar a `?v=2`, `?v=3`, etc.

## Ejemplos de uso

Botón con utilities:

```txt
u-bg-primary u-text-white u-px-4 u-py-2 u-rounded u-shadow-md u-hover:bg-primary-hover u-transition
```

Botón con componente:

```txt
uic-btn uic-btn--primary u-hover:shadow-md u-active:scale-95
```

Tarjeta:

```txt
uic-card u-p-4 u-shadow-md u-rounded u-bg-surface
```

Grid responsive:

```txt
u-grid u-grid-cols-1 u-md:grid-cols-2 u-lg:grid-cols-3 u-gap-4
```

### Alineación individual con `justify-self`

Aplicá estas clases al elemento hijo de una grilla para alinearlo dentro de su celda en el eje inline (horizontal en escritura habitual):

| Clase | Declaración CSS |
| --- | --- |
| `u-justify-self-auto` | `justify-self: auto` |
| `u-justify-self-start` | `justify-self: start` |
| `u-justify-self-end` | `justify-self: end` |
| `u-justify-self-center` | `justify-self: center` |
| `u-justify-self-stretch` | `justify-self: stretch` |

`auto` toma la alineación definida por `justify-items` en el contenedor. `stretch` ocupa el espacio disponible cuando el ancho del elemento es automático. Estas clases no tienen efecto sobre elementos flex; las clases `u-self-*` existentes aplican `align-self`.

Las cinco clases tienen variantes `u-sm:`, `u-md:`, `u-lg:`, `u-xl:` y `u-2xl:`. Las variantes responsive usan `!important`, igual que las demás utilidades responsive del proyecto.

```html
<div class="u-grid u-grid-cols-1 u-gap-4">
  <div class="u-justify-self-start">Al inicio</div>
  <div class="u-justify-self-center">Centrado</div>
  <div class="u-justify-self-end">Al final</div>
  <div class="u-justify-self-stretch">Ocupa el ancho disponible</div>
  <div class="u-justify-self-start u-md:justify-self-end">
    Al inicio en mobile y al final desde 768px
  </div>
</div>
```

## Responsive

Breakpoints:

```txt
sm:  desde 640px
md:  desde 768px
lg:  desde 1024px
xl:  desde 1280px
2xl: desde 1536px
```

Ejemplo:

```txt
u-grid u-grid-cols-1 u-md:grid-cols-2 u-lg:grid-cols-3
```

Resultado:

```txt
Mobile: 1 columna
Tablet: 2 columnas
Desktop: 3 columnas
```

## Mostrar y ocultar

Oculto siempre:

```txt
u-hidden
```

Oculto en mobile, visible desde `md`:

```txt
u-hidden u-md:block
```

Visible en mobile, oculto desde `md`:

```txt
u-block u-md:hidden
```

## Pseudo-clases

En CSS se definen escapadas:

```css
.u-hover\:bg-primary:hover {
  background-color: var(--color-primary);
}
```

En GeneXus se usan normales:

```txt
u-hover:bg-primary
```

Ejemplos:

```txt
u-hover:bg-primary
u-hover:bg-primary-hover
u-hover:text-white
u-hover:border-primary
u-hover:shadow-md
u-hover:opacity-80
u-hover:scale-105
u-focus:border-primary
u-focus:outline-primary
u-focus-visible:outline-primary
u-active:bg-primary-hover
u-active:scale-95
u-disabled:opacity-50
u-disabled:cursor-not-allowed
u-placeholder:text-muted
u-placeholder:opacity-75
```

## Documentación web

Abrir localmente:

```txt
docs/index.html
```

Publicada en GitHub Pages:

```txt
https://facuur001.github.io/municipal-utilities/docs/
```

## Publicación en servidor

Para publicar en un servidor estático, subir como mínimo:

```txt
build/municipal-design-system.css
build/municipal-design-system.min.css
```

Opcionalmente también subir:

```txt
docs/
```

Ejemplo productivo:

```txt
https://static.riocuarto.gov.ar/design-system/1.0.0/municipal-design-system.min.css
```

## Versionado recomendado

```txt
/design-system/1.0.0/municipal-design-system.min.css
/design-system/1.1.0/municipal-design-system.min.css
/design-system/1.2.0/municipal-design-system.min.css
```

## Reglas de mantenimiento

No editar `build/` manualmente.

Editar siempre:

```txt
src/theme.css
src/utilities.css
src/components/*.css
```

Después ejecutar:

```bash
npm run build:css
```

## Resumen

```txt
src/  → archivos editables
build/ → archivos generados para usar en GeneXus
docs/ → documentación web
```

Archivo recomendado para GeneXus:

```txt
build/municipal-design-system.min.css
```
