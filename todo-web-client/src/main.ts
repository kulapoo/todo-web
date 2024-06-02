import { RootApp } from "./App.tsx"


customElements.define("root-app", RootApp)

document.body.innerHTML = `
  <root-app></root-app>
`
