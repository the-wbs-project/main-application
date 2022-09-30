export class CloudflareStorageService {
  constructor(private readonly bucket: R2Bucket) {}

  async get<T>(fileName: string, folders: string[]): Promise<T | null> {
    const key = `${folders.join("/")}/${fileName}`;
    const object = await this.bucket.get(key);

    return object == null ? null : <T>object.json();
  }

  async put<T>(fileName: string, folders: string[], body: T): Promise<void> {
    const key = `${folders.join("/")}/${fileName}`;

    await this.bucket.put(key, JSON.stringify(body));
  }
}
/* async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    switch (request.method) {
      case 'PUT':
        await env.MY_BUCKET.put(key, request.body);
        return new Response(`Put ${key} successfully!`);
      case 'GET':
        const object = await env.MY_BUCKET.get(key);

        if (object === null) {
          return new Response('Object Not Found', { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);

        return new Response(object.body, {
          headers,
        });
      case 'DELETE':
        await env.MY_BUCKET.delete(key);
        return new Response('Deleted!');

      default:
        return new Response('Method Not Allowed', {
          status: 405,
          headers: {
            Allow: 'PUT, GET, DELETE',
          },
        });
    }
  },
};*/
