import { Application } from 'express';

import { createTask } from '@/services/TaskService';
import { TaskStatus } from '@/types/task';
import { parseGovUkDate } from '@/utils/dateHelper';
import { classifyAxiosError } from '@/utils/errorClassifier';
import { redirectWithFlash } from '@/utils/flash';
import { constructErrors, validateTaskForm } from '@/utils/validation';

export default function (app: Application): void {
  // GET /tasks/new - Show create task form
  app.get('/tasks/new', (req, res) => {
    res.render('tasks/new', {
      task: {
        title: '',
        description: '',
        dueDateDay: '',
        dueDateMonth: '',
        dueDateYear: '',
      },
      csrfToken: req.csrfToken(),
      errors: null,
    });
  });

  // POST /tasks - Submit create task form
  app.post('/tasks', async (req, res) => {
    const { title, description } = req.body;
    const day = req.body['dueDate-day'];
    const month = req.body['dueDate-month'];
    const year = req.body['dueDate-year'];

    const formData = {
      title,
      description,
      dueDateDay: day,
      dueDateMonth: month,
      dueDateYear: year,
    };

    try {
      const clientErrors = validateTaskForm({ title, day, month, year });

      if (Object.keys(clientErrors).length > 0) {
        return res.render('tasks/new', {
          task: formData,
          csrfToken: req.csrfToken(),
          errors: clientErrors,
        });
      }

      const dueDate = parseGovUkDate(day, month, year)!;

      const created = await createTask({
        title,
        description: description || null,
        dueDate,
        status: TaskStatus.PENDING,
      });

      redirectWithFlash(res, `/tasks/${created.id}`, 'Task created successfully');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating task:', error);

      const result = classifyAxiosError(error);

      if (result.status === 400) {
        const errors = result.validationErrors ? constructErrors(result.validationErrors) : { _message: result.message };
        return res.render('tasks/new', {
          task: formData,
          csrfToken: req.csrfToken(),
          errors,
        });
      }

      res.render('tasks/new', {
        task: formData,
        csrfToken: req.csrfToken(),
        errors: { _message: 'Unable to create task. Please try again.' },
      });
    }
  });
}
