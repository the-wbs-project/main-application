import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowRotateBack,
  faEraser,
  faThumbsUp,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { EditorComponent } from '@wbs/components/_utils/editor.component';

@Component({
  standalone: true,
  selector: 'wbs-ai-description-editor',
  templateUrl: './description-ai-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonGroupModule,
    ButtonModule,
    EditorComponent,
    FontAwesomeModule,
    TranslateModule,
  ],
})
export class DescriptionAiEditorComponent {
  readonly containerHeight = input.required<number>();
  readonly proposal = model.required<string>();
  readonly actionSelected = output<string>();

  readonly faEraser = faEraser;
  readonly faArrowRotateBack = faArrowRotateBack;
  readonly faThumbsUp = faThumbsUp;
}
