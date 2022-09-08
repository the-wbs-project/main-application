export interface StorageService {
  get<T>(fileName: string, folders: string[]): Promise<T | null>;

  put<T>(fileName: string, folders: string[], body: T): Promise<void>;
}
