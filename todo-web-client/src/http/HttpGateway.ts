import appConfig from "@/appConfig"
import { Task } from "@/core/Entities/Task"


export function getTasks() {
  return fetch(appConfig.apiUrl + "/tasks")
}

export function getTask(id: string) {
  return fetch(appConfig.apiUrl + "/tasks/" + id)
}

export function createTask(task: Task) {
  return fetch(appConfig.apiUrl + "/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...task,
      completed: false
    })
  })
}

export function updateTask(task: Task) {
  const { id, ...rest } = task
  return fetch(appConfig.apiUrl + "/tasks/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(rest)
  })
}

export function deleteTask(id: string) {
  return fetch(appConfig.apiUrl + "/tasks/" + id, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer admin",
      "Content-Type": "application/json"
    },
  })
}

export function markTaskAsCompleted(id: string) {
  return fetch(appConfig.apiUrl + "/tasks/" + id + "/completed", {
    method: "PATCH",
    headers: {
      "Authorization": "Bearer admin",
      "Content-Type": "application/json"
    }
  })
}