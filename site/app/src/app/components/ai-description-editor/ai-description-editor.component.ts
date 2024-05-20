import {
  ChangeDetectionStrategy,
  Component,
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
import { EditorModule } from '@progress/kendo-angular-editor';
import { EditorComponent } from '../../components/_utils/editor.component';

@Component({
  standalone: true,
  selector: 'wbs-ai-description-editor',
  templateUrl: './ai-description-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EditorComponent, EditorModule, FontAwesomeModule, TranslateModule],
})
export class AiDescriptionEditorComponent {
  readonly proposal = model.required<string>();
  readonly actionSelected = output<string>();

  readonly faEraser = faEraser;
  readonly faArrowRotateBack = faArrowRotateBack;
  readonly faThumbsUp = faThumbsUp;
}
