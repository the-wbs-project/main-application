import { NgModule } from '@angular/core';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SharedModule } from '@wbs/shared/module';
import { LabelDialogComponent } from './label-dialog.component';
import { LabelDialogService } from './label-dialog.service';

@NgModule({
  imports: [SharedModule, TextBoxModule],
  providers: [LabelDialogService],
  declarations: [LabelDialogComponent],
})
export class LabelDialogModule {}
