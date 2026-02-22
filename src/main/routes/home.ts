import { Application } from 'express';

import { searchTasks } from '@/services/TaskService';
import { STATUS_OPTIONS, formatTask } from '@/types/task';
import { extractTaskSearchParams } from '@/utils/queryParser';

export default function (app: Application): void {
  app.get('/', async (req, res) => {
    try {
      const searchParams = extractTaskSearchParams(req.query);
      const pageData = await searchTasks(searchParams);

      const buildPageUrl = (pageNum: number): string => {
        const params = new URLSearchParams(req.query as Record<string, string>);
        params.set('page', pageNum.toString());
        return `/?${params}`;
      };

      const { size, number, totalElements, totalPages } = pageData.page;
      const isFirst = number === 0;
      const isLast = number === totalPages - 1;

      const paginationItems = Array.from({ length: totalPages }, (_, i) => ({
        number: i + 1,
        current: i === number,
        href: buildPageUrl(i),
      }));

      res.render('home', {
        tasks: pageData.content.map(formatTask),
        pagination: {
          currentPage: number,
          totalPages,
          totalElements,
          size,
          isFirst,
          isLast,
          previousUrl: !isFirst ? buildPageUrl(number - 1) : null,
          nextUrl: !isLast ? buildPageUrl(number + 1) : null,
          items: paginationItems,
          startItem: number * size + 1,
          endItem: Math.min((number + 1) * size, totalElements),
        },
        filters: req.query,
        statusOptions: STATUS_OPTIONS,
        flashMessageText: req.query.flashMessageText as string | undefined,
        flashMessageType: req.query.flashMessageType as string | undefined,
        error: null,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching tasks:', error);

      res.render('home', {
        tasks: [],
        pagination: null,
        filters: req.query,
        statusOptions: STATUS_OPTIONS,
        error: {
          title: 'There is a problem',
          message: 'Unable to load tasks. Please try again later.',
        },
      });
    }
  });
}
