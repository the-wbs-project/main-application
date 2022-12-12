import { NgModule } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedBasicModule } from '@wbs/shared/basic-module';
import { WbsActionButtonsComponent } from './wbs-action-buttons.component';

@NgModule({
  imports: [NgbTooltipModule, SharedBasicModule],
  declarations: [WbsActionButtonsComponent],
  exports: [WbsActionButtonsComponent],
})
export class WbsActionButtonsModule {}
