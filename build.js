const esbuild = require("esbuild");
const cssModulesPlugin = require("esbuild-css-modules-plugin");

esbuild
  .build({
    logLevel: "info",
    entryPoints: ["src/index.tsx"],
    bundle: true,
    sourcemap: true,
    outdir: "dist/js",
    plugins: [cssModulesPlugin()],
  })
  .catch(() => process.exit(1));
