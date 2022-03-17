import { Logger } from './logger.service';

export async function myFetch(
  mainRequest: Request,
  logger: Logger,
  input: Request | string,
  init?: RequestInit,
): Promise<Response> {
  const method = typeof input === 'string' ? init?.method : input.method;
  const url = typeof input === 'string' ? input : input.url;
  const start = new Date();
  let response: Response | null = null;

  try {
    response = await fetch(input, init);

    return response;
  } finally {
    const duration = (new Date().getTime() - start.getTime()) * 1000;
    logger.trackDependency(mainRequest, url, method, duration, response);
  }
}
