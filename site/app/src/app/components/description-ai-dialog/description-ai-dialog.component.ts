import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { AiDescriptionChatComponent } from '@wbs/components/ai-description-chat';
import { AiStore } from '@wbs/core/store';

@Component({
  standalone: true,
  selector: 'wbs-description-ai-dialog',
  templateUrl: './description-ai-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AiDescriptionChatComponent, DialogModule, TranslateModule],
})
export class DescriptionAiDialogComponent {
  readonly startingDialog = input.required<string>();
  readonly description = input.required<string | undefined>();
  readonly models = inject(AiStore).models;

  readonly closed = output<void>();
  readonly descriptionChange = output<string>();
}
