import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Category, Project, SaveState } from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { FadingMessageComponent } from '@wbs/main/components/fading-message.component';
import { SaveButtonComponent } from '@wbs/main/components/save-button.component';
import { CategorySelectionService } from '@wbs/main/services';
import { ProjectRolesComponent } from '../../../../components/project-roles/project-roles.component';
import { ProjectState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './phases.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FadingMessageComponent,
    FontAwesomeModule,
    ProjectRolesComponent,
    SaveButtonComponent,
    TranslateModule,
  ],
})
export class PhasesComponent implements OnInit {
  private readonly catService = inject(CategorySelectionService);
  private readonly store = inject(Store);

  readonly plus = faPlus;
  readonly checkIcon = faCheck;
  readonly cats = input.required<Category[]>();
  readonly isDirty = signal(false);
  readonly showAddDialog = signal(false);
  readonly saveState = signal<SaveState>('ready');
  readonly disciplines = signal<CategorySelection[] | undefined>(undefined);

  ngOnInit(): void {
    this.disciplines.set(
      this.catService.build(this.cats() ?? [], this.getProject().phases ?? [])
    );
  }

  private getProject(): Project {
    return this.store.selectSnapshot(ProjectState.current)!;
  }
}
