import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { AvatarModule } from '@progress/kendo-angular-layout';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import {
  FileSelectComponent,
  FileSelectModule,
  SelectEvent,
} from '@progress/kendo-angular-upload';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-profile-avatar-editor',
  templateUrl: './avatar-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvatarModule,
    ButtonModule,
    FileSelectModule,
    ImageCropperComponent,
  ],
})
export class AvatarEditorComponent {
  readonly current = input.required<string | undefined>();
  readonly imageToCrop = signal<string | undefined>(undefined);
  readonly cancel = output<void>();

  onFileChange(comp: FileSelectComponent, event: SelectEvent) {
    console.log(event);

    comp.clearFiles();

    if (event.files.length > 0) {
      const _file = URL.createObjectURL(event.files[0].rawFile!);
      this.imageToCrop.set(_file);
      comp.clearFiles();
    }
  }

  /*openAvatarEditor(image: string): Observable<any> {
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: image,
    });

    return dialogRef.afterClosed();
  }*/

  resetInput() {
    const input = document.getElementById(
      'avatar-input-file'
    ) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  cropped(image: string) {
    console.log(image);
    this.imageToCrop.set(undefined);
  }
}
