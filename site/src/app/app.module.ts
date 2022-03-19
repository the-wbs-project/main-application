import { NgModule } from '@angular/core';
import { CoreModule } from '@app/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WbsTreeModule } from './features';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    CoreModule,
    TranslateModule.forRoot(),
    WbsTreeModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
