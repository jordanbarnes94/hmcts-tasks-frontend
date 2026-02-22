import { Application } from 'express';

import { getTaskById } from '@/services/TaskService';
import { TaskStatus, formatTask } from '@/types/task';
import { classifyAxiosError } from '@/utils/errorClassifier';

export default function (app: Application): void {
  app.get('/tasks/:id(\\d+)', async (req, res) => {
    try {
      const taskId = req.params.id;
      const task = await getTaskById(taskId);
      const formattedTask = formatTask(task);

      res.render('tasks/view', {
        task: formattedTask,
        TaskStatus,
        flashMessageText: req.query.flashMessageText as string | undefined,
        flashMessageType: req.query.flashMessageType as string | undefined,
        error: null,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching task:', error);

      const result = classifyAxiosError(error);
      if (result.status === 404) {
        return res.status(404).render('not-found', { message: 'Task not found' });
      }

      res.render('tasks/view', {
        task: null,
        error: {
          title: 'There is a problem',
          message: 'Unable to load task. Please try again later.',
        },
      });
    }
  });
}
