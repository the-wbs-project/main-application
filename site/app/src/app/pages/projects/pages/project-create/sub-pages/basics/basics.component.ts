import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer';
import { SubmitBasics } from '../../actions';
import { PROJECT_CREATION_PAGES } from '../../models';
import { ProjectCreateService } from '../../services';
import { ProjectCreateState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './basics.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EditorModule,
    FormsModule,
    TextBoxModule,
    TranslateModule,
    WizardFooterComponent,
  ],
})
export class BasicsComponent {
  readonly org = input.required<string>();
  readonly title = this.store.selectSnapshot(ProjectCreateState.title);
  readonly description = this.store.selectSnapshot(
    ProjectCreateState.description
  );

  constructor(
    private readonly service: ProjectCreateService,
    private readonly store: Store
  ) {}

  back(): void {
    this.service.nav(this.org(), PROJECT_CREATION_PAGES.GETTING_STARTED);
  }

  continue(title: string, description: string): void {
    this.store.dispatch(new SubmitBasics(title.trim(), description.trim()));
    this.service.nav(this.org(), PROJECT_CREATION_PAGES.CATEGORY);
  }
}
