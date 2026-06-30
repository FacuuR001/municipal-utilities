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
│   ├── components.css
│   └── index.css
│
├── dist/
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
- `utilities.css`: clases utilitarias tipo `flex`, `p-4`, `bg-primary`, `hover:bg-primary`, `md:hidden`.
- `components.css`: componentes reutilizables como `btn`, `card`, `input`, `badge`, `alert`, `table`.
- `index.css`: archivo de entrada que importa theme, utilities y components.

Contenido de `src/index.css`:

```css
@import url("./theme.css");
@import url("./utilities.css");
@import url("./components.css");
```

### `dist/`

Contiene los archivos finales generados automáticamente.

- `municipal-design-system.css`: CSS completo sin minificar.
- `municipal-design-system.min.css`: CSS minificado para usar en GeneXus.

No editar manualmente los archivos de `dist/`.

### `docs/`

Contiene la documentación web.

- `index.html`: página principal.
- `docs.css`: estilos propios de la documentación.
- `docs.js`: lógica del buscador, regiones y ejemplos.

### `scripts/`

Contiene scripts de automatización.

- `build-css.js`: compila los CSS de `src/` y genera los archivos de `dist/`.

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
dist/municipal-design-system.css
dist/municipal-design-system.min.css
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
src/components.css
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
Form.HeaderRawHTML += !'<link rel="stylesheet" type="text/css" href="https://facuur001.github.io/municipal-utilities/dist/municipal-design-system.min.css?v=1">'
```

El parámetro `?v=1` ayuda a evitar problemas de caché. Cuando se actualice el CSS se puede cambiar a `?v=2`, `?v=3`, etc.

## Ejemplos de uso

Botón con utilities:

```txt
bg-primary text-white px-4 py-2 rounded shadow-md hover:bg-primary-hover transition
```

Botón con componente:

```txt
btn btn-primary hover:shadow-md active:scale-95
```

Tarjeta:

```txt
card p-4 shadow-md rounded bg-surface
```

Grid responsive:

```txt
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
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
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
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
hidden
```

Oculto en mobile, visible desde `md`:

```txt
hidden md:block
```

Visible en mobile, oculto desde `md`:

```txt
block md:hidden
```

## Pseudo-clases

En CSS se definen escapadas:

```css
.hover\:bg-primary:hover {
  background-color: var(--color-primary);
}
```

En GeneXus se usan normales:

```txt
hover:bg-primary
```

Ejemplos:

```txt
hover:bg-primary
hover:bg-primary-hover
hover:text-white
hover:border-primary
hover:shadow-md
hover:opacity-80
hover:scale-105
focus:border-primary
focus:outline-primary
focus-visible:outline-primary
active:bg-primary-hover
active:scale-95
disabled:opacity-50
disabled:cursor-not-allowed
placeholder:text-muted
placeholder:opacity-75
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
dist/municipal-design-system.css
dist/municipal-design-system.min.css
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

No editar `dist/` manualmente.

Editar siempre:

```txt
src/theme.css
src/utilities.css
src/components.css
```

Después ejecutar:

```bash
npm run build:css
```

## Resumen

```txt
src/  → archivos editables
dist/ → archivos generados para usar en GeneXus
docs/ → documentación web
```

Archivo recomendado para GeneXus:

```txt
dist/municipal-design-system.min.css
```
