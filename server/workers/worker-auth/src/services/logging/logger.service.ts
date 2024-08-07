export interface Logger {
  trackEvent(message: string, status: 'Error' | 'Info' | 'Warn' | 'Notice', data?: Record<string, any>): void;
  trackException(message: string, exception: Error, data?: Record<string, any>): void;
  trackDependency(url: string, method: string, duration: number, request: Request, response?: Response): void;
}
