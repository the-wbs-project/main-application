import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorModule } from '@progress/kendo-angular-editor';
import { FloatingLabelModule } from '@progress/kendo-angular-label';
import { SharedModule } from '@wbs/shared/module';
import { CategoryListEditorModule } from '../category-list-editor';
import { TaskCreateComponent } from './task-create.component';
import { TaskCreateService } from './task-create.service';

@NgModule({
  imports: [
    CategoryListEditorModule,
    EditorModule,
    FloatingLabelModule,
    NgbModalModule,
    SharedModule,
  ],
  providers: [TaskCreateService],
  declarations: [TaskCreateComponent],
})
export class TaskCreateModule {}
