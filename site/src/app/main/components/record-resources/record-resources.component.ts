import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { RecordResource } from '@wbs/core/models';
import { ResourceEditorComponent } from './components/resource-editor/resource-editor.component';
import { ResourceListComponent } from './components/resource-list/resource-list.component';
import { RecordResourceViewModel } from './view-models';

@Component({
  standalone: true,
  selector: 'wbs-record-resources',
  templateUrl: './record-resources.component.html',
  imports: [
    FontAwesomeModule,
    NgIf,
    ResourceEditorComponent,
    ResourceListComponent,
    TranslateModule,
  ],
})
export class RecordResourcesComponent {
  @Input({ required: true }) list!: RecordResource[];
  @Input({ required: true }) claims!: string[];

  @Output() readonly save = new EventEmitter<RecordResource>();

  faPlus = faPlus;
  vm?: RecordResourceViewModel;

  constructor(readonly modalService: NgbModal, private readonly store: Store) {}

  launchNew(content: any): void {
    this.vm = {
      description: '',
      name: '',
      url: '',
    };
    const modal = this.modalService.open(content, {
      fullscreen: true,
      modalDialogClass: 'modal-almost-fullscreen',
    });
  }
}
