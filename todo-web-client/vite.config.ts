import { defineConfig, loadEnv } from "vite"
import path from "path"
import litCss from "vite-plugin-lit-css"
import replacePlugin from "@rollup/plugin-replace"

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "")

  const replaceValues = {
    "process.env.API_URL": `"${env.API_URL}"`,
  }

  return {
    plugins: [
      litCss({
        exclude: "./src/style.css"
      }),
      replacePlugin({
        values: replaceValues,
        preventAssignment: true
      })
    ],
    build: {
      minify: "terser",  // Ensure you're using terser as the minifier
      terserOptions: {
        keep_classnames: true,
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      }
    },
  }
})