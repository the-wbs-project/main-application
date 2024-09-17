import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';

@Component({
  standalone: true,
  templateUrl: './pdf-dialog.component.html',
  styleUrl: './pdf-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, FormsModule],
})
export class PdfDialogComponent extends DialogContentBase {
  private readonly _sanitizer = inject(DomSanitizer);

  protected title = signal<string>('');
  protected file = signal<ArrayBuffer | undefined>(undefined);
  protected readonly url = computed(() => this.transformImage(this.file()));

  constructor(dialogRef: DialogRef) {
    super(dialogRef);
  }

  static launch(dialog: DialogService, title: string, file: ArrayBuffer): void {
    const ref = dialog.open({
      content: PdfDialogComponent,
    });
    const component = ref.content.instance as PdfDialogComponent;

    component.title.set(title);
    component.file.set(file);
  }

  protected transformImage(
    buffer: ArrayBuffer | undefined
  ): SafeUrl | undefined {
    if (!buffer) return undefined;

    let TYPED_ARRAY = new Uint8Array(buffer);
    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');
    let base64String = btoa(STRING_CHAR);

    return this._sanitizer.bypassSecurityTrustResourceUrl(
      'data:application/pdf;base64, ' + base64String
    );
  }
}
