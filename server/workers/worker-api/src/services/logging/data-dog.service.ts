import { Env } from '../../config';

export class DataDogService {
  private readonly logs: any[] = [];

  constructor(private readonly env: Env) {}

  appendLog(log: any): void {
    this.logs.push(log);
  }

  async flush(): Promise<Response | void> {
    try {
      const res = await fetch('https://http-intake.logs.us5.datadoghq.com/api/v2/logs', {
        method: 'POST',
        body: JSON.stringify(this.logs),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'DD-API-KEY': this.env.DATADOG_API_KEY,
        },
      });

      console.log('log flush status: ' + res.status);

      return res;
    } catch (e) {
      //@ts-ignore
      console.log(e.message);
    }
  }
}
