import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Messages } from '@wbs/core/services';
import { first } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'wbs-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SwitchComponent {
  @Input({ required: true }) value!: boolean;
  @Input() size: 'lg' | 'sm' = 'lg';
  @Input() confirmMessage?: string;
  @Input() confirmData?: Record<string, string>;
  @Output() valueChange = new EventEmitter<boolean>();

  constructor(private readonly messages: Messages) {}

  changed(e: Event, cb: HTMLInputElement): void {
    if (!this.confirmMessage || cb.checked) {
      this.valueChange.emit(cb.checked);
      return;
    }

    this.messages.confirm
      .show('General.Confirmation', this.confirmMessage, this.confirmData)
      .pipe(first())
      .subscribe((answer) => {
        if (answer) {
          this.valueChange.emit(cb.checked);
        } else {
          e.preventDefault();
          cb.checked = !cb.checked;
        }
      });
  }
}
