import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  model,
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
  readonly value = model.required<boolean>();
  readonly size = input<'lg' | 'sm'>('lg');
  readonly confirmMessage = input<string>();
  readonly confirmData = input<Record<string, string>>();

  constructor(private readonly messages: Messages) {}

  changed(e: Event, cb: HTMLInputElement): void {
    const confirmMessage = this.confirmMessage();
    const confirmData = this.confirmData();

    if (!confirmMessage || cb.checked) {
      this.value.set(cb.checked);
      return;
    }

    this.messages.confirm
      .show('General.Confirmation', confirmMessage, confirmData)
      .pipe(first())
      .subscribe((answer) => {
        if (answer) {
          this.value.set(cb.checked);
        } else {
          e.preventDefault();
          cb.checked = !cb.checked;
        }
      });
  }
}
