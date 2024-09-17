import { NgClass } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-test-dialog',
  templateUrl: './test-dialog.component.html',
  styleUrls: ['./test-dialog.component.scss'],
  imports: [ButtonModule, FontAwesomeModule, NgClass],
})
export class WbsBootstrapDialogComponent {
  readonly closeIcon = faTimes;

  @Input() title: string = 'Dialog Title';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showClose: boolean = true;
  @Input() isVisible: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
    this.close.emit();
  }

  onCancel() {
    this.cancel.emit();
    this.close.emit();
  }
}
