import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { DisciplineEditorComponent } from '@wbs/components/discipline-editor';
import { CategoryService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { ProjectCreateStore } from '../project-create.store';

@Component({
  standalone: true,
  selector: 'wbs-project-create-disciplines',
  template: `<div class="d-flex flex-flow-col h-100">
    <div class="text-start mg-t-10 w-100 flex-fill">
      <div class="tx-12">
        <wbs-alert
          type="info"
          [dismissible]="false"
          message="ProjectCreate.Disciplines_Description"
        />
      </div>
      <div class="d-flex justify-content-center">
        <div class="w-100 mx-wd-500">
          <wbs-discipline-editor
            [showAdd]="true"
            [categories]="disciplines()"
            (categoriesChange)="changed($event!)"
          />
        </div>
      </div>
    </div>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent, DisciplineEditorComponent],
})
export class ProjectCreateDisciplinesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly store = inject(ProjectCreateStore);

  readonly disciplines = signal<CategorySelection[]>([]);

  ngOnInit(): void {
    this.disciplines.set(
      this.categoryService.buildDisciplines(this.store.disciplines())
    );
  }

  changed(disciplines: CategorySelection[]): void {
    this.store.disciplines.set(
      this.categoryService.extract(disciplines, []).categories
    );
  }
}
