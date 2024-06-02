import { registerComponents } from "./registerComponents"
export class RootApp extends HTMLElement {
  constructor() {
    super()
    registerComponents()

  }

  connectedCallback() {
    this.render()
  }

  protected render() {
    this.innerHTML = /*html*/ `
      <task-directory></task-directory>
    `
  }
}
