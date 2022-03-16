export class BaseHttpService {
  buildJson<T>(json: T): Response {
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: {
        "content-type": "application/json;charset=utf-8",
      },
    });
  }
}
