import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule } from '@progress/kendo-angular-editor';
import { ProjectCategory, PROJECT_NODE_VIEW, WbsNode } from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { CategorySelectionService } from '@wbs/main/services';
import { LibraryEntryModalModel } from '../../models';

@Component({
  standalone: true,
  templateUrl: './library-entry-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EditorModule, FormsModule, TranslateModule],
  providers: [CategorySelectionService],
})
export class LibraryEntryModalComponent implements OnInit {
  @ViewChild('titleTextBox', { static: true }) titleTextBox!: ElementRef;

  readonly more = signal<boolean>(false);

  title = '';
  description = '';
  includeResources = false;
  visibility = 0;

  constructor(readonly modal: NgbActiveModal) {}

  ngOnInit(): void {
    (<HTMLInputElement>this.titleTextBox.nativeElement).focus();
  }

  setup(data: LibraryEntryModalModel): void {
    this.title = data.title;
    this.description = data.description;
    this.includeResources = data.includeResources;
    this.visibility = data.visibility;
  }

  save(nav: boolean): void {
    if (!this.title) return;

    const model: LibraryEntryModalModel = {
      title: this.title,
      description: this.description,
      includeResources: this.includeResources,
      visibility: this.visibility,
      nav,
    };

    this.modal.close(model);
  }
}
