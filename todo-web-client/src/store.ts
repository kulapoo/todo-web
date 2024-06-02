import { StoreApi, createStore } from "zustand/vanilla"
import { Task } from "./core/Entities/Task"


export type StoreState = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export function configureStore<T extends StoreState>(set: StoreApi<T>["setState"]): StoreState {
  return {
    tasks: [],
    setTasks: (tasks: Task[]) => set((prev) => ({ ...prev, tasks }))
  }
}

export const store = createStore(configureStore)