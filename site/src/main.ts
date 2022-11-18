import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBolt,
  faBridgeSuspension,
  faBuilding,
  faFlask,
  faDroneAlt,
  faPipeValve,
  faScrewdriverWrench,
} from '@fortawesome/pro-solid-svg-icons';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

library.add(faBolt);
library.add(faBridgeSuspension);
library.add(faBuilding);
library.add(faFlask);
library.add(faDroneAlt);
library.add(faPipeValve);
library.add(faScrewdriverWrench);

//@ts-ignore
Notiflix.Loading.standard();

if (environment.production) {
  enableProdMode();
}
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
