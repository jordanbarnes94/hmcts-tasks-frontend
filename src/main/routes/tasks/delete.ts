import { Application } from 'express';

import { deleteTask, getTaskById } from '@/services/TaskService';
import { formatTask } from '@/types/task';
import { classifyAxiosError } from '@/utils/errorClassifier';
import { redirectWithFlash } from '@/utils/flash';

export default function (app: Application): void {
  // GET /tasks/:id/delete - Show delete confirmation page
  app.get('/tasks/:id/delete', async (req, res) => {
    const taskId = req.params.id;
    try {
      const task = await getTaskById(taskId);
      const formattedTask = formatTask(task);

      res.render('tasks/delete', {
        task: formattedTask,
        csrfToken: req.csrfToken(),
        error: null,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching task for deletion:', error);

      const result = classifyAxiosError(error);
      if (result.status === 404) {
        return res.status(404).render('not-found', { message: 'Task not found' });
      }

      res.status(500).render('error', { message: 'Unable to load task' });
    }
  });

  // POST /tasks/:id/delete - Actually delete the task
  // Note: We use POST here (not DELETE) because HTML forms only support GET/POST
  // The TaskService.deleteTask() will make the actual DELETE request to the API
  app.post('/tasks/:id/delete', async (req, res) => {
    const taskId = req.params.id;
    try {
      await deleteTask(taskId);
      redirectWithFlash(res, '/', 'Task deleted successfully');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting task:', error);

      const result = classifyAxiosError(error);
      if (result.status === 404) {
        return res.status(404).render('not-found', { message: 'Task not found' });
      }

      // Try to fetch task details for re-rendering confirmation page with error
      try {
        const task = await getTaskById(taskId);
        const formattedTask = formatTask(task);

        return res.render('tasks/delete', {
          task: formattedTask,
          csrfToken: req.csrfToken(),
          error: {
            title: 'There is a problem',
            message: 'Unable to delete task. Please try again later.',
          },
        });
      } catch {
        res.status(500).render('error', { message: 'Unable to delete task' });
      }
    }
  });
}
