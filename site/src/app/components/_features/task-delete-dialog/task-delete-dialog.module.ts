import { NgModule } from '@angular/core';
import { SharedModule } from '@wbs/shared/module';
import { TaskDeleteDialogComponent } from './task-delete-dialog.component';

@NgModule({
  imports: [SharedModule],
  declarations: [TaskDeleteDialogComponent],
  exports: [],
})
export class TaskDeleteDialogModule {}
