import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  standalone: true,
  selector: 'wbs-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, QuillModule],
  template: `<quill-editor
    [class]="cssClass()"
    [modules]="modules"
    [(ngModel)]="value"
  />`,
})
export class EditorComponent {
  readonly value = model.required<string>();
  readonly cssClass = model<string>();
  readonly modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button
    ],
  };
}
