import { html, render } from "@github/jtml"

export class TaskList extends HTMLElement {
  static styles = /*css*/ `
    :host {
      display: block;
      width: 100%;
    }
    ul {
      width: 100%;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      grid-gap: var(--sl-spacing-medium, 16px);
    }
  `
  connectedCallback() {
    this.attachShadow({ mode: "open" })
    render(
      html`
        <style>
          ${TaskList.styles}
        </style>
        <ul>
          <slot></slot>
        </ul>
      `,
      this.shadowRoot!
    )
  }

}
