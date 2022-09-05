import { NgModule } from '@angular/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { CategorySelectionService } from './category-selection.service';
import { ConfirmationService } from './confirmation.service';
import { LoadingService } from './loading.service';
import { ProjectService } from './project.service';
import { ScriptService } from './script.service';
import { TitleService } from './title.service';
import { WbsTransformers } from './transformers';
import { UiService } from './ui.service';

@NgModule({
  imports: [DialogModule],
  providers: [
    CategorySelectionService,
    ConfirmationService,
    LoadingService,
    ProjectService,
    ScriptService,
    TitleService,
    UiService,
    WbsTransformers,
  ],
})
export class ServiceModule {}
