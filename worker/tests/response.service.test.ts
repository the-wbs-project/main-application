import { Config } from '../src/services/config.service';
import { ResponseService } from '../src/services/response.service';
//import makeServiceWorkerEnv from 'service-worker-mock';

class TestConfig implements Config {
  get corsUrl(): string | undefined {
    return 'http://www.johndoe.com';
  }
}

declare var global: any;

describe('ResponseService', () => {
  beforeAll(() => {});

  test('ResponseService optionsAsync', async () => {
    const response = await new ResponseService(new TestConfig()).optionsAsync();
    expect(response.headers.get('Access-Control-Request-Method')).toEqual(
      'POST',
    );
  });
});
