/// <reference types="@angular/localize" />

import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
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
import { AppComponent } from '@wbs/app.component';
import { appConfig } from '@wbs/app.config';
import { AppConfiguration } from '@wbs/core/models';

//import 'hammerjs';

/*
library.add(faBolt);
library.add(faBridgeSuspension);
library.add(faBuilding);
library.add(faFlask);
library.add(faDroneAlt);
library.add(faPipeValve);
library.add(faScrewdriverWrench);
*/

//@ts-ignore
Notiflix.Loading.standard();

const config = (window as any).appConfig as AppConfiguration;
//
//  Always assume production mode, if it's not explicitly set to development
//
if (config.environment !== 'development') {
  enableProdMode();
}
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
