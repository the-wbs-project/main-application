import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { ProjectCreateStore } from '../project-create.store';

@Component({
  standalone: true,
  selector: 'wbs-project-create-basics',
  template: `<div class="tx-12 text-start">
      <wbs-alert
        type="info"
        [dismissible]="false"
        message="ProjectCreate.Basics_Description"
      />
    </div>
    <kendo-textbox
      #titleEditor
      [(ngModel)]="store.title"
      [placeholder]="'Projects.ProjectTitle' | translate"
    />
    <br />
    <br />
    <kendo-editor
      #descriptionEditor
      [(ngModel)]="store.description"
      [placeholder]="'Projects.ProjectDescription' | translate"
    />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    EditorModule,
    FormsModule,
    TextBoxModule,
    TranslateModule,
  ],
})
export class ProjectCreateBasicsComponent {
  readonly store = inject(ProjectCreateStore);
}
