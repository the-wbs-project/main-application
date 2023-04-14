import { Logger } from './logger.service';

export async function myFetch(
  mainRequest: Request | undefined,
  logger: Logger,
  input: RequestInfo,
  init?: RequestInit<RequestInitCfProperties>,
): Promise<Response> {
  let method: string | undefined;
  let url: string | undefined;

  if (typeof input === 'string') {
    method = init?.method ?? 'GET';
    url = input;
  } else if (input instanceof URL) {
    method = init?.method ?? 'GET';
    url = input.toString();
  } else {
    method = input.method;
    url = input.url;
  }
  const start = new Date();
  let response: Response | null = null;

  try {
    response = await fetch(input, init);

    return response;
  } finally {
    const duration = (new Date().getTime() - start.getTime()) * 1000;
    logger.trackDependency(url, method, duration, mainRequest, response);
  }
}
