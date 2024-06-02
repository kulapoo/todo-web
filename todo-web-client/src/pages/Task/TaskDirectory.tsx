import { html, render } from "@github/jtml"

import "../../registerComponents"
import { StoreApi, createStore } from "zustand/vanilla"
import { TaskPresenterState, createTaskPresenter } from "./TaskPresenter"
import { Task } from "@/core/Entities/Task"

export class TaskDirectory extends HTMLElement {

  taskPresenter: StoreApi<TaskPresenterState>

  constructor() {
    super()
    this.taskPresenter = createStore(createTaskPresenter)
    const abortController = new AbortController()
    window.addEventListener("beforeunload", () => {}, { signal: abortController.signal})
    abortController.abort()
  }

  static styles = /*css*/ `
    :host {
      display: block;

    }

    input, textarea {
      width: 100%;
    }

    .list-item-actions {
      display: flex;
      justify-content: flex-end;
    }

    .list-item-actions sl-icon-button {
      font-size: 1.5rem;
      color: var(--sl-color-primary-400, #6200ea);
    }
  `
 // lifecycle methods
  connectedCallback() {
    this.render()

    const unsub = this.taskPresenter.subscribe(() => this.render())
    this.taskPresenter.getState().loadTasks()

    this.addEventListener("disconnectedCallback", unsub)

  }


  // event handlers
  #handleTaskItemClick = (e: Event) => {
    const $currEl = e.currentTarget as HTMLElement
    const elemId = (e.target as HTMLElement).getAttribute("elem-id")
    if (elemId === "mark-as-completed") {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    const selectedTask = this.taskPresenter.getState().tasks.find(task => task.id === $currEl.getAttribute("id"))

    if (elemId === "delete-task") {
      this.taskPresenter.setState((prev) => ({
        ...prev,
        deleteConfirmDialogOpen: true,
        selectedTask,
      }))
      return
    }

    this.taskPresenter.setState((prev) => ({
      ...prev,
      taskItemDialogOpen: true,
      selectedTask,
      isAdd: false
    }))
  }

  #handleAddTaskClick = () => {
    this.taskPresenter.setState((prev) => ({
      ...prev,
      taskItemDialogOpen: true,
      selectedTask: null,
      isAdd: true
    }))

    // work around on "value" attribute not updating
    const $input = this.querySelector(`input[name="title"]`) as HTMLInputElement
    const $textarea = this.querySelector(`textarea[name="description"]`) as HTMLTextAreaElement

    $input.value = ""
    $textarea.value = ""
  }


  #resetState = () => {
    this.taskPresenter.setState((prev) => ({
      ...prev,
      selectedTask: null,
      taskItemDialogOpen: false,
      deleteConfirmDialogOpen: false,
      markConfirmDialogOpen: false,
      isAdd: false
    }))

  }

  #saveTask = async () => {
    const { selectedTask, isAdd } = this.taskPresenter.getState()
    if (!selectedTask) return

    if (isAdd) {
      await this.taskPresenter.getState().addTask(selectedTask)
    } else {
      await this.taskPresenter.getState().updateTask(selectedTask)
    }

    this.#resetState()
  }

  #deleteTask = async () => {
    const { selectedTask } = this.taskPresenter.getState()
    if (!selectedTask) return
    await this.taskPresenter.getState().deleteTask(selectedTask!.id)
    this.#resetState()
  }

  #markTaskAsCompleted = async (e: Event) => {
    const $currEl = e.currentTarget as HTMLElement
    const id = $currEl.getAttribute("id")
    if (!id) return

    await this.taskPresenter.getState().markTaskAsCompleted(id)
    this.#resetState()
  }

  #handleTaskInputChange = (e: Event) => {
    const { selectedTask, isAdd } = this.taskPresenter.getState()
    if (!isAdd && !selectedTask?.id) return
    const $currEl = e.currentTarget as HTMLInputElement | HTMLTextAreaElement

    const name = $currEl.getAttribute("name") as "title" | "description"
    const value = $currEl.value

    const updatedTask = {
      ...selectedTask,
      [name]: String(value).trim() ? value : selectedTask?.[name]
    }

    this.taskPresenter.setState((prev) => ({
      ...prev,
      selectedTask: updatedTask  as Task
    }))
  }

  // renderers
  #renderDialog = () => {
    const { selectedTask, taskItemDialogOpen, isAdd } = this.taskPresenter.getState()
    let shouldOpen = Boolean(selectedTask && taskItemDialogOpen)

    if (isAdd) {
      shouldOpen = !!taskItemDialogOpen
    }

    const invalid = !String(selectedTask?.title || "").trim() || !String(selectedTask?.description || "").trim()

    const titleVal = selectedTask?.title ? selectedTask?.title : ""
    const descVal = selectedTask?.description ? selectedTask?.description : ""
    return html`
      <sl-dialog
        onsl-hide="${this.#resetState}"
        no-header
        class="dialog-overview"
        open="${shouldOpen}"
      >
        <label> Title </label>
        <br />
        <input
          name="title"
          value="${titleVal}"
          oninput="${this.#handleTaskInputChange}"
          autofocus
          tabindex="0"
        />

        <br />
        <br />
        <label> Description </label>
        <br />
        <textarea
          value="${descVal}"
          name="description"
          oninput="${this.#handleTaskInputChange}"
          tabindex="1"
        >
${selectedTask?.description}</textarea
        >
        <sl-button
          disabled="${invalid}"
          slot="footer"
          tabindex="2"
          onclick="${this.#saveTask}"
          >Save</sl-button
        >
      </sl-dialog>
    `
  }

  #renderDelConfirmationDialog = () => {
    const { deleteConfirmDialogOpen } = this.taskPresenter.getState()
    return html`
      <sl-dialog
        onsl-hide="${this.#resetState}"
        no-header
        class="dialog-overview"
        open="${Boolean(deleteConfirmDialogOpen)}"
      >
        <label>Are you sure you want to delete this task?</label>
        <br />
        <br />
        <sl-button
          slot="footer"
          onclick="${this.#deleteTask}"
          >Yes</sl-button
        >
        <sl-button
          slot="footer"
          onclick="${this.#resetState}"
          >No</sl-button
        >
      </sl-dialog>
    `
  }

  #renderListItem(task: Task) {
    return html`
      <task-list-item id="${task.id}" onclick="${this.#handleTaskItemClick}">
        <span slot="title">${task.title}</span>
        <p slot="description">${task.description}</p>
        <div slot="footer" class="list-item-actions">
          <sl-icon-button
            id="${task.id}"
            elem-id="delete-task"
            name="trash"
            label="Delete task"
          ></sl-icon-button>
          <sl-icon-button
            id="${task.id}"
            elem-id="mark-as-completed"
            label="Mark as completed"
            name="${!task.completed ? "toggle-off" : "toggle-on"}"
            onclick="${this.#markTaskAsCompleted}"
          ></sl-icon-button>
        </div>
      </task-list-item>
    `
  }

  protected render() {
    const { tasks } = this.taskPresenter.getState()
    render(
      html`
        <style>${TaskDirectory.styles}</style>
        <app-bar>
          <span slot="title">TODO - Rust, WebComponents, Zustand</span>
          <div slot="actions">
            <sl-button onclick="${this.#handleAddTaskClick}" variant="default" size="large" circle>
              <sl-icon name="file-earmark-plus" label="Add note"></sl-icon>
            </sl-button>
          </div>
        </app-bar>
        <task-list>
          ${!!tasks.length ? tasks.map(task => this.#renderListItem(task)) : ""}
        </task-list>
        ${this.#renderDialog()}
        ${this.#renderDelConfirmationDialog()}
      `,
      this
    )
  }
}