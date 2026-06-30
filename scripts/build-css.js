const fs = require("fs");
const path = require("path");
const CleanCSS = require("clean-css");
const chokidar = require("chokidar");

const root = path.resolve(__dirname, "..");

const srcFiles = [
    path.join(root, "src", "theme.css"),
    path.join(root, "src", "utilities.css"),
    path.join(root, "src", "components.css"),
];

const distDir = path.join(root, "dist");

const outputCss = path.join(distDir, "municipal-design-system.css");
const outputMinCss = path.join(distDir, "municipal-design-system.min.css");

function buildCss() {
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir);
    }

    const banner = `/*
 * Municipal Design System
 * Archivo generado automáticamente desde /src
 * No editar directamente este archivo.
 */\n\n`;

    const css = srcFiles
        .map((file) => {
            const fileName = path.basename(file);

            if (!fs.existsSync(file)) {
                throw new Error(`No existe el archivo: ${fileName}`);
            }

            const content = fs.readFileSync(file, "utf8");

            return `/* ========================================================= */
/* ${fileName} */
/* ========================================================= */\n\n${content}`;
        })
        .join("\n\n");

    const finalCss = banner + css;

    fs.writeFileSync(outputCss, finalCss, "utf8");

    const minified = new CleanCSS({
        level: 2,
    }).minify(finalCss);

    if (minified.errors.length > 0) {
        console.error("Errores al minificar:");
        console.error(minified.errors);
        process.exit(1);
    }

    fs.writeFileSync(outputMinCss, minified.styles, "utf8");

    console.log("CSS generado correctamente:");
    console.log("dist/municipal-design-system.css");
    console.log("dist/municipal-design-system.min.css");
}

buildCss();

if (process.argv.includes("--watch")) {
    console.log("Modo watch activo. Esperando cambios en /src...");

    chokidar.watch(srcFiles).on("change", (filePath) => {
        console.log(`Cambio detectado: ${path.basename(filePath)}`);
        buildCss();
    });
}