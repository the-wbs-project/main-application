import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import {
  KENDO_PDFVIEWER,
  PDFViewerTool,
} from '@progress/kendo-angular-pdfviewer';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, KENDO_PDFVIEWER],
  template: `<kendo-dialog
    [title]="title()"
    width="90%"
    height="90%"
    (close)="dialog.close()"
  >
    @if (file(); as file) {
    <kendo-pdfviewer
      style="height: 100%"
      [tools]="tools"
      [arrayBuffer]="file"
      [saveFileName]="title() + '.pdf'"
    />
    }
  </kendo-dialog> `,
})
export class PdfDialogComponent extends DialogContentBase {
  protected title = signal<string>('');
  protected file = signal<ArrayBuffer | null>(null);
  readonly tools: PDFViewerTool[] = [
    'pager',
    'spacer',
    'zoomInOut',
    'zoom',
    'selection',
    'spacer',
    'search',
    'download',
    'print',
  ];

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
}
