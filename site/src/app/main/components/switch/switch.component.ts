import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { DialogService } from '@wbs/main/services';
import { first } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'wbs-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [DialogService],
})
export class SwitchComponent {
  @Input({ required: true }) value!: boolean;
  @Input() confirmMessage?: string;
  @Input() confirmData?: Record<string, string>;
  @Output() valueChange = new EventEmitter<boolean>();

  constructor(private readonly dialog: DialogService) {}

  changed(e: Event, cb: HTMLInputElement): void {
    if (!this.confirmMessage || cb.checked) {
      this.valueChange.emit(cb.checked);
      return;
    }

    this.dialog
      .confirm('General.Confirmation', this.confirmMessage, this.confirmData)
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
