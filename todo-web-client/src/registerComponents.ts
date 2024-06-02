import "@shoelace-style/shoelace/dist/components/card/card.js"
import "@shoelace-style/shoelace/dist/components/dialog/dialog.js"
import "@shoelace-style/shoelace/dist/components/button/button.js"


import { AppBar } from "./components/Layouts/AppBar"
import { TaskList } from "./pages/Task/components/TaskList"
import { TaskListItem } from "./pages/Task/components/TaskListItem"
import { TaskDirectory } from "./pages/Task/TaskDirectory"


export function registerComponents() {
  // components
  customElements.define("app-bar", AppBar)

  // feature components
  customElements.define("task-list", TaskList)
  customElements.define("task-list-item", TaskListItem)
  customElements.define("task-directory", TaskDirectory)
}
