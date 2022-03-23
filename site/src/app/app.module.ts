import { NgModule } from '@angular/core';
import { CoreModule } from '@app/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, CoreModule, TranslateModule.forRoot()],
  bootstrap: [AppComponent],
  providers: [],
})
export class AppModule {}
