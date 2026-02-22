import { del, get, post, put } from '@/modules/api';
import { CreateTaskRequest, PageResponse, Task, TaskSearchParams, UpdateTaskRequest } from '@/types/task';

export async function searchTasks(params: TaskSearchParams): Promise<PageResponse<Task>> {
  return get<PageResponse<Task>>('tasks', params);
}

export async function getTaskById(id: string): Promise<Task> {
  return get<Task>(`tasks/${id}`);
}

export async function createTask(data: CreateTaskRequest): Promise<Task> {
  return post<Task>('tasks', data);
}

export async function updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
  return put<Task>(`tasks/${id}`, data);
}

export async function deleteTask(id: string): Promise<void> {
  return del<void>(`tasks/${id}`);
}
