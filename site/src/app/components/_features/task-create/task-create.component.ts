import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectCategory, PROJECT_NODE_VIEW, WbsNode } from '@wbs/core/models';
import { CategorySelectionService, IdService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { BehaviorSubject } from 'rxjs';

@Component({
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TaskCreateComponent implements OnInit {
  @ViewChild('titleTextBox', { static: true }) titleTextBox!: ElementRef;

  readonly discipline = PROJECT_NODE_VIEW.DISCIPLINE;
  readonly more$ = new BehaviorSubject<boolean>(false);

  title = '';
  description = '';
  disciplines?: CategorySelection[];

  constructor(
    readonly modal: NgbActiveModal,
    private readonly catService: CategorySelectionService
  ) {}

  ngOnInit(): void {
    (<HTMLInputElement>this.titleTextBox.nativeElement).focus();
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
