export interface OriginService {
  getResponseAsync(suffix?: string): Promise<Response>;
  getTextAsync(suffix?: string): Promise<string | undefined>;
  getAsync<T>(suffix?: string): Promise<T | undefined>;
  putAsync(body: any, suffix?: string): Promise<Response>;
  postAsync(body: any, suffix?: string): Promise<Response>;
  deleteAsync(suffix?: string): Promise<Response>;
}
