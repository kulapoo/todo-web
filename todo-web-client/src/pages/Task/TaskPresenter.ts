import { Task } from "@/core/Entities/Task"
import { StoreApi } from "zustand/vanilla"
import { createTask, deleteTask, getTasks, markTaskAsCompleted, updateTask } from "./TaskService"

export type TaskPresenterState = {
  tasks: Task[];
  selectedTask: Task | null;
  fetching: boolean;
  isAdd: boolean;
  submitting: boolean;
  taskItemDialogOpen: boolean;
  deleteConfirmDialogOpen: boolean;
  setTasks: (tasks: Task[]) => void;
  loadTasks: () => void;
  updateTask: (task: Task) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  markTaskAsCompleted: (id: string) => void;
}

export function createTaskPresenter<T extends TaskPresenterState>(set: StoreApi<T>["setState"], getState: StoreApi<T>["getState"]): TaskPresenterState {
  return {
    fetching: false,
    selectedTask: null,
    isAdd: false,
    submitting: false,
    taskItemDialogOpen: false,
    deleteConfirmDialogOpen: false,
    tasks: [],
    setTasks: (tasks: Task[]) => set((prev) => ({ ...prev, tasks })),
    async addTask(task: Task) {
      try {
        set((prev) => ({
          ...prev,
          submitting: true
        }))
        const newTask = await createTask(task)
        set((prev) => ({
          ...prev,
          submitting: false,
          tasks: [...prev.tasks, newTask]
        }))
      } catch(ex) {
        console.error(ex)
      }
    },
    async loadTasks() {
      try {

        set((prev) => ({
          ...prev,
          fetching: true
        }))
        const tasks = await getTasks()
        set((prev) => ({
          ...prev,
          fetching: false,
          tasks
        }))
      } catch(ex) {
        console.error(ex)
      }
    },

    async updateTask(task: Task) {
      try {
        set((prev) => ({
          ...prev,
          submitting: true
        }))
        const updatedTask = await updateTask(task)
        set((prev) => ({
          ...prev,
          submitting: false,
          tasks: prev.tasks.map(task => task.id === updatedTask.id ? updatedTask : task)
        }))
      } catch(ex) {
        console.error(ex)
      }
    },

    async deleteTask(id: string) {
      try {
        set((prev) => ({
          ...prev,
          submitting: true
        }))
        await deleteTask(id)
        set((prev) => {
          return ({
            ...prev,
            submitting: false,
            tasks: prev.tasks.filter(task => task.id !== id)
          })
        })
      } catch(ex) {
        console.error(ex)
      }
    },

    async markTaskAsCompleted(id: string) {
      try {
        set((prev) => ({
          ...prev,
          submitting: true
        }))
        const { tasks } = getState()
        const currentTask = tasks.find(task => task.id === id)
        if (!currentTask) return
        await markTaskAsCompleted(id)
        set((prev) => ({
          ...prev,
          submitting: false,
          tasks: prev.tasks.map(task => task.id === currentTask.id ? ({ ...task, completed: !task.completed }) : task)
        }))
      } catch(ex) {
        console.error(ex)
      }
    }
  }
}
