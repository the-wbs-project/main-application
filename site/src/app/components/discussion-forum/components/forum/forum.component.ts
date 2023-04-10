import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  faTriangleExclamation,
  faEllipsisVertical,
} from '@fortawesome/pro-light-svg-icons';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { CreateThread, EditThread } from '@wbs/core/actions';
import { Discussion } from '../../models';
import { DiscussionForumState } from '../../states';

@Component({
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ForumComponent implements OnInit {
  @ViewChild('threadEditor') threadEditor!: any;

  readonly threads$ = this.store.select(DiscussionForumState.threads);
  readonly faPlus = faPlus;
  readonly faEllipsisVertical = faEllipsisVertical;
  readonly faTriangleExclamation = faTriangleExclamation;
  readonly form = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required,
      noWhitespaceValidator,
    ]),
    message: new FormControl<string>('', [
      Validators.required,
      noWhitespaceValidator,
    ]),
  });

  private editId?: string;
  private modalRef?: NgbModalRef;
  modalTitle?: string;

  constructor(
    private readonly modalService: NgbModal,
    private readonly store: Store
  ) {}

  ngOnInit(): void {}

  createThread(): void {
    this.editId = undefined;
    this.modalTitle = 'General.CreateThread';

    this.form.setValue({
      title: '',
      message: '',
    });
    this.modalRef = this.modalService.open(this.threadEditor, {
      modalDialogClass: 'forum-modal',
      size: 'fullscreen',
    });
  }

  editThread(model: Discussion): void {
    this.editId = model.id;
    this.modalTitle = 'General.EditThread';

    this.form.setValue({
      title: model.title ?? '',
      message: model.text ?? '',
    });
    this.modalService.open(this.threadEditor, {
      modalDialogClass: 'forum-modal',
      //size: 'fullscreen',
    });
  }

  submit() {
    this.modalRef?.close();

    const values = this.form.getRawValue();

    if (values.title && values.message) {
      this.store.dispatch(
        this.editId
          ? new EditThread(this.editId, values.title, values.message)
          : new CreateThread(values.title, values.message)
      );
    }
  }
}

function noWhitespaceValidator(control: FormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { whitespace: true };
}
