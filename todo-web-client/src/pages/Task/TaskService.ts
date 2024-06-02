import { Task } from "@/core/Entities/Task"
import { intoJSON } from "@/http/HttpUtils"
import * as HttpGateway from "@/http/HttpGateway"

export async function getTasks() {
  return intoJSON(HttpGateway.getTasks())
}

export async function createTask(task: Task) {
  return intoJSON(HttpGateway.createTask(task))
}

export async function updateTask(task: Task) {
  const response = HttpGateway.updateTask(task)
  return intoJSON(response)
}

export async function deleteTask(id: string) {
  const response = await HttpGateway.deleteTask(id)
  if (!response.ok) {
    throw new Error("Failed to delete task")
  }
}

export async function markTaskAsCompleted(id: string) {
  const response = await HttpGateway.markTaskAsCompleted(id)
  if (!response.ok) {
    throw new Error("Failed to mark task as completed")
  }
}