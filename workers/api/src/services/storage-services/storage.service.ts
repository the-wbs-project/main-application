export interface StorageService {
  get<T>(fileName: string, folders: string[]): Promise<T | null>;

  getAsResponse(fileName: string, folders?: string[]): Promise<Response | null>;

  put<T>(fileName: string, folders: string[], body: T): Promise<void>;
}
