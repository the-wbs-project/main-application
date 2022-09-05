import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as utc from 'dayjs/plugin/utc';
import * as dayjs from 'dayjs';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

dayjs.extend(utc);

if (environment.production) {
  enableProdMode();
}
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
