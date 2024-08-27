import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule],
  template: `<kendo-dialog
    [title]="title()"
    width="90%"
    height="90%"
    (close)="dialog.close()"
  >
    @if (file(); as file) {
    <img class="mw-100 mh-100" [src]="file" />
    }
  </kendo-dialog> `,
})
export class ImageDialogComponent extends DialogContentBase {
  private readonly domSanitizer = inject(DomSanitizer);

  protected title = signal<string>('');
  protected file = signal<SafeUrl | null>(null);

  constructor(dialogRef: DialogRef) {
    super(dialogRef);
  }

  static launch(dialog: DialogService, title: string, file: ArrayBuffer): void {
    const ref = dialog.open({
      content: ImageDialogComponent,
    });
    const component = ref.content.instance as ImageDialogComponent;

    component.title.set(title);
    component.file.set(component.transformImage(file));
  }

  protected transformImage(buffer: ArrayBuffer): SafeUrl {
    let TYPED_ARRAY = new Uint8Array(buffer);
    const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, '');
    let base64String = btoa(STRING_CHAR);

    return this.domSanitizer.bypassSecurityTrustUrl(
      'data:image/jpg;base64, ' + base64String
    );
  }
}
