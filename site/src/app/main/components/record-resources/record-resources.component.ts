import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  PROJECT_CLAIMS,
  RESOURCE_TYPES,
  RecordResource,
} from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { CheckPipe } from '@wbs/main/pipes/check.pipe';
import { ResourceEditorComponent } from './components/resource-editor/resource-editor.component';
import { ResourceListComponent } from './components/resource-list/resource-list.component';
import { RecordResourceValidation } from './services';
import { RecordResourceViewModel } from './view-models';

@Component({
  standalone: true,
  selector: 'wbs-record-resources',
  templateUrl: './record-resources.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckPipe,
    FontAwesomeModule,
    NgIf,
    ResourceEditorComponent,
    ResourceListComponent,
    TranslateModule,
  ],
  providers: [RecordResourceValidation],
})
export class RecordResourcesComponent {
  @Input({ required: true }) list!: RecordResource[];
  @Input({ required: true }) claims!: string[];
  @Output() readonly save = new EventEmitter<Partial<RecordResource>>();

  private modal?: NgbModalRef;
  readonly faPlus = faPlus;
  readonly addClaim = PROJECT_CLAIMS.RESOURCES.CREATE;
  readonly vm = signal<RecordResourceViewModel>({
    description: '',
    name: '',
    url: '',
    errors: {},
  });

  constructor(
    private readonly messages: Messages,
    private readonly modalService: NgbModal,
    private readonly validator: RecordResourceValidation
  ) {}

  launchNew(content: any): void {
    this.messages.notify.info('Coming soon...', false);
    //this.modal = this.modalService.open(content, {
    //  fullscreen: true,
    //  modalDialogClass: 'modal-almost-fullscreen',
    //});
  }

  saveClicked(): void {
    const vm = this.vm();

    console.log('save clicked', vm);

    var valid = this.validator.validate(vm);

    this.vm.set(structuredClone(vm));

    if (!valid) return;

    if (vm.type === RESOURCE_TYPES.LINK) {
      this.save.emit({
        id: vm.id,
        type: vm.type,
        description: vm.description,
        name: vm.name,
        resource: vm.url,
      });
    } else {
    }

    this.modal?.close();
  }
}
