/// <reference types="@angular/localize" />

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
import { Logger } from '@wbs/core/services';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@wbs/app.component';
import { appConfig } from '@wbs/app.config';

Logger.setup();

library.add(faBolt);
library.add(faBridgeSuspension);
library.add(faBuilding);
library.add(faFlask);
library.add(faDroneAlt);
library.add(faPipeValve);
library.add(faScrewdriverWrench);

//@ts-ignore
Notiflix.Loading.standard();

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
