import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { faCancel, faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'wbs-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextEditorComponent {
  @Input() value: string | undefined | null;
  @Input() height = '50px';
  @Input() fontSize = '24px';
  @Output() valueChange = new EventEmitter<string>();
  @ViewChild('textbox', { static: false }) textbox?: TextBoxComponent;

  readonly faCancel = faCancel;
  readonly faCheck = faCheck;
  readonly edit$ = new BehaviorSubject<boolean>(false);

  editValue = '';

  edit(): void {
    this.editValue = this.value!;
    this.edit$.next(true);

    setTimeout(() => {
      this.textbox!.focus();
    }, 50);
  }

  saveValue(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
    this.edit$.next(false);
  }
}
