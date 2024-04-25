import { Context } from '../../config';

export class StorageService {
  constructor(private readonly bucket: R2Bucket) {}

  async list(folders: string[]): Promise<R2Object[]> {
    const folder = folders.join('/');

    const results = await this.bucket.list({
      prefix: folder,
    });

    return results.objects;
  }

  async get<T>(fileName: string, folders: string[]): Promise<T | null> {
    const key = `${folders.join('/')}/${fileName}`;
    const object = await this.bucket.get(key);

    return object == null ? null : <T>object.json();
  }

  async getAsResponseAsync(ctx: Context, fileName: string, folders?: string[]): Promise<Response> {
    fileName = decodeURIComponent(fileName);

    const key = folders ? `${folders.join('/')}/${fileName}` : fileName;
    const object = await this.bucket.get(key);

    if (!object) return ctx.text('Not Found', 404);

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);

    return ctx.newResponse(object.body, {
      headers,
    });
  }

  async putAsync(body: ReadableStream<any> | null, fileName: string, folders?: string[]): Promise<void> {
    const key = folders ? `${folders.join('/')}/${fileName}` : fileName;

    await this.bucket.put(key, body);
  }
}
