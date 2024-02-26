import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { FileInfo, FileSelectModule } from '@progress/kendo-angular-upload';

@Component({
  standalone: true,
  selector: 'wbs-uploader',
  templateUrl: './uploader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FileSelectModule, NgClass],
  styles: ['.k-dropzone-inner { background-color: #c8dadf; }'],
})
export class UploaderComponent {
  readonly zoneMessage = input<string | undefined>();

  @Output() readonly removed = new EventEmitter<void>();
  @Output() readonly uploaded = new EventEmitter<FileInfo>();
}
