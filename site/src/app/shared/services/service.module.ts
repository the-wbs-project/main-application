import { NgModule } from '@angular/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ConfirmationService } from './confirmation.service';
import { LoadingService } from './loading.service';
import { ScriptService } from './script.service';
import { TitleService } from './title.service';
import { WbsTransformers } from './transformers';
import { UiService } from './ui.service';

@NgModule({
  imports: [DialogModule],
  providers: [
    ConfirmationService,
    LoadingService,
    ScriptService,
    TitleService,
    UiService,
    WbsTransformers,
  ],
})
export class ServiceModule {}