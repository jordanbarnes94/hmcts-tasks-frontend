import { formatDate, formatDateTime } from '@/utils/dateHelper';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  statusDisplayValue: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Status options for form select dropdowns.
 * Maps enum values to human-readable display text.
 */
export const STATUS_OPTIONS = [
  { value: TaskStatus.PENDING, text: 'Pending' },
  { value: TaskStatus.IN_PROGRESS, text: 'In Progress' },
  { value: TaskStatus.COMPLETED, text: 'Completed' },
] as const;

export interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface TaskSearchParams {
  page: number;
  size: number;
  search?: string;
  status?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string | null;
  dueDate: string;
  status: TaskStatus;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string | null;
  dueDate: string;
  status: TaskStatus;
}

/**
 * Format a task for display by adding formatted date fields.
 * Uses dateHelper for consistent date formatting.
 * - dueDate: Date only (no time) since users only input the day
 * - createdAt/updatedAt: Full timestamp with time
 */
export function formatTask(task: Task) {
  return {
    ...task,
    createdAtFormatted: formatDateTime(task.createdAt),
    updatedAtFormatted: formatDateTime(task.updatedAt),
    dueDateFormatted: formatDate(task.dueDate),
  };
}
