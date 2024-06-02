export class AppBar extends HTMLElement{
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this.render()
  }

  protected render() {
    this.shadowRoot!.innerHTML = /*html*/ `
      <style>
        :host {
          display: block;
          width: 100%;
          background-color: var(--sl-color-primary-400, #6200ea);
          color: var(--sl-color-neutral-white, white);
          box-shadow: var(--app-bar-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.2));
        }
        .app-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--app-bar-padding, 16px);
        }
        .title {
          font-size: var(--app-bar-title-font-size, 1.25rem);
        }
        .actions {
          display: flex;
          gap: var(--app-bar-actions-gap, 8px);
        }
      </style>
      <header class="app-bar">
        <div class="title">
          <slot name="title"></slot>
        </div>
        <nav class="actions">
          <slot name="actions"></slot>
        </nav>
      </header>
    `
  }
}