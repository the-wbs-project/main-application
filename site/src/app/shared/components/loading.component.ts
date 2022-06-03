import { Component } from '@angular/core';
import { DialogContentBase, DialogRef } from '@progress/kendo-angular-dialog';
import { BehaviorSubject } from 'rxjs';
@Component({
  template: ` <div>
    <img src="assets/img/loader.svg" class="loader-img" alt="loader" />
    <span *ngIf="message$ | async; let message">
      {{ message | translate }}
    </span>
  </div>`,
  styles: ['div { text-align: center; }', 'span { margin-top: 20px; }'],
})
export class LoadingComponent extends DialogContentBase {
  readonly message$ = new BehaviorSubject<string | null>(null);

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  closeMe() {
    console.log('close this thing down!');
    this.dialog.close('closing');
  }
}
