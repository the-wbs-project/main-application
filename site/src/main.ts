/// <reference types="@angular/localize" />

import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '@wbs/app.component';
import { appConfig } from '@wbs/app.config';
import { environment } from './env';

import 'hammerjs';

//@ts-ignore
Notiflix.Loading.standard();
//
//  Always assume production mode, if it's not explicitly set to development
//
if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
