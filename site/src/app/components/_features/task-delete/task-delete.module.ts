import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedBasicModule } from '@wbs/shared/basic-module';
import { SharedModule } from '@wbs/shared/module';
import { TaskDeleteComponent } from './task-delete.component';
import { TaskDeleteService } from './task-delete.service';

@NgModule({
  imports: [NgbModalModule, SharedModule],
  providers: [TaskDeleteService],
  declarations: [TaskDeleteComponent],
})
export class TaskDeleteModule {}
