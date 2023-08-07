import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule } from '@progress/kendo-angular-editor';
import { ProjectCategory, PROJECT_NODE_VIEW, WbsNode } from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { CategorySelectionService } from '@wbs/main/services';
import { BehaviorSubject } from 'rxjs';
import { CategoryListEditorComponent } from '../category-list-editor';

@Component({
  standalone: true,
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    CategoryListEditorComponent,
    CommonModule,
    EditorModule,
    FormsModule,
    TranslateModule,
  ],
  providers: [CategorySelectionService],
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
