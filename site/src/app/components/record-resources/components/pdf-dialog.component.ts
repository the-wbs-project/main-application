import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { PDFViewerModule } from '@progress/kendo-angular-pdfviewer';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, PDFViewerModule],
  template: `<kendo-dialog width="90%" height="90%" (close)="dialog.close()">
    <kendo-dialog-titlebar class="bg-gray-200">
      {{ title() }}
    </kendo-dialog-titlebar>
    <kendo-pdfviewer
      [data]="url()"
      [saveFileName]="downloadTitle()"
      style="height: 100%; width: 100%"
    />
  </kendo-dialog>`,
})
export class PdfDialogComponent extends DialogContentBase {
  protected title = signal<string>('');
  protected file = signal<ArrayBuffer | undefined>(undefined);
  protected readonly url = computed(() => this.transformImage(this.file()));
  protected readonly downloadTitle = computed(() => `${this.title()}.pdf`);

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
  ): string | undefined {
    if (!buffer) return undefined;

    let TYPED_ARRAY = new Uint8Array(buffer);
    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');
    let base64String = btoa(STRING_CHAR);

    return 'data:application/pdf;base64, ' + base64String;
  }
}
