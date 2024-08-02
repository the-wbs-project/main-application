import { APP_QUEUE } from './app.queue';
import { APP_ROUTES } from './app.routes';
import { APP_SCHEDULED } from './app.scheduled';

export default {
  fetch: APP_ROUTES.fetch,
  scheduled: APP_SCHEDULED,
  queue: APP_QUEUE,
};
