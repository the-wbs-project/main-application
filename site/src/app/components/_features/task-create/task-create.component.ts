import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import {
  ProjectCategory,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  WbsNode,
} from '@wbs/core/models';
import { CategorySelectionService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { BehaviorSubject } from 'rxjs';

@Component({
  templateUrl: './task-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCreateComponent implements OnInit {
  @ViewChild(TextBoxComponent, { static: false })
  readonly titleTextBox!: TextBoxComponent;

  readonly discipline: PROJECT_NODE_VIEW_TYPE = PROJECT_NODE_VIEW.DISCIPLINE;
  readonly more$ = new BehaviorSubject<boolean>(false);
  title = '';
  description = '';
  disciplines?: CategorySelection[];

  constructor(
    readonly modal: NgbActiveModal,
    private readonly catService: CategorySelectionService
  ) {}

  ngOnInit(): void {
    this.focus();
  }

  private focus() {
    if (!this.titleTextBox) {
      setTimeout(() => {
        this.focus();
      }, 50);
      return;
    }
    this.titleTextBox.focus();
  }

  setup(disciplines: ProjectCategory[]): void {
    this.disciplines = this.catService.buildFromList(
      PROJECT_NODE_VIEW.DISCIPLINE,
      disciplines,
      []
    );
  }

  save(nav: boolean): void {
    if (!this.title) return;

    const model: Partial<WbsNode> = {
      title: this.title,
    };

    if (this.more$.getValue()) {
      if (this.description) model.description = this.description;

      const disciplines: string[] = [];

      for (const cat of this.disciplines ?? []) {
        if (cat.selected) disciplines.push(cat.id);
      }
      if (disciplines.length > 0) model.disciplineIds = disciplines;
    }
    this.modal.close({ model, nav });
  }
}