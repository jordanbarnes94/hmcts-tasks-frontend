import { Application } from 'express';

import { getTaskById, updateTask } from '@/services/TaskService';
import { STATUS_OPTIONS, TaskStatus } from '@/types/task';
import { extractDateComponents, parseGovUkDate } from '@/utils/dateHelper';
import { classifyAxiosError } from '@/utils/errorClassifier';
import { redirectWithFlash } from '@/utils/flash';
import { constructErrors, validateTaskForm } from '@/utils/validation';

export default function (app: Application): void {
  // GET /tasks/:id/edit - Show edit task form
  app.get('/tasks/:id(\\d+)/edit', async (req, res) => {
    try {
      const taskId = req.params.id;
      const task = await getTaskById(taskId);
      const { day: dueDateDay, month: dueDateMonth, year: dueDateYear } = extractDateComponents(task.dueDate);

      res.render('tasks/edit', {
        task: {
          id: task.id,
          title: task.title,
          description: task.description || '',
          status: task.status,
          dueDateDay,
          dueDateMonth,
          dueDateYear,
        },
        statusOptions: STATUS_OPTIONS,
        csrfToken: req.csrfToken(),
        errors: null,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching task for edit:', error);

      const result = classifyAxiosError(error);
      if (result.status === 404) {
        return res.status(404).render('not-found', { message: 'Task not found' });
      }

      res.status(500).render('error', { message: 'Unable to load task for editing' });
    }
  });

  // POST /tasks/:id - Submit edit task form
  app.post('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    const { title, description, status } = req.body;
    const day = req.body['dueDate-day'];
    const month = req.body['dueDate-month'];
    const year = req.body['dueDate-year'];

    const formData = {
      id: taskId,
      title,
      description,
      status,
      dueDateDay: day || '',
      dueDateMonth: month || '',
      dueDateYear: year || '',
    };

    try {
      const clientErrors = validateTaskForm({ title, day, month, year, status });

      if (Object.keys(clientErrors).length > 0) {
        return res.render('tasks/edit', {
          task: formData,
          statusOptions: STATUS_OPTIONS,
          csrfToken: req.csrfToken(),
          errors: clientErrors,
        });
      }

      const dueDate = parseGovUkDate(day, month, year)!;

      await updateTask(taskId, {
        title,
        description: description || null,
        dueDate,
        status: status as TaskStatus,
      });

      redirectWithFlash(res, `/tasks/${taskId}`, 'Task updated successfully');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating task:', error);

      const result = classifyAxiosError(error);

      if (result.status === 400) {
        const errors = result.validationErrors ? constructErrors(result.validationErrors) : { _message: result.message };
        return res.render('tasks/edit', {
          task: formData,
          statusOptions: STATUS_OPTIONS,
          csrfToken: req.csrfToken(),
          errors,
        });
      }

      res.render('tasks/edit', {
        task: formData,
        statusOptions: STATUS_OPTIONS,
        csrfToken: req.csrfToken(),
        errors: { _message: 'Unable to update task. Please try again.' },
      });
    }
  });
}
