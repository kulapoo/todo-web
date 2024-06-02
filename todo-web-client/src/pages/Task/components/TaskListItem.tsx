import { attr } from "@github/catalyst"
import { html, render } from "@github/jtml"

export class TaskListItem extends HTMLElement {
  @attr id = ""
  @attr title = ""
  @attr description = ""

  connectedCallback() {
    this.attachShadow({ mode: "open" })
    this.render()
  }

  static styles = /*css*/ `
    :host {
      list-style: none;
      cursor: pointer;
    }

    sl-card {
      width: 300px;
    }
  `

  render() {
    render(
      html`
        <style>
          ${TaskListItem.styles}
        </style>
        <li id="${this.id}">
          <sl-card>
            <div slot="header">
              <slot name="title"></slot>
            </div>
            <slot name="description"></slot>
            <slot name="footer"></slot>
          </sl-card>
        </li>
      `,
      this.shadowRoot!,
    )
  }
}
