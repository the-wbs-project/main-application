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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AiDescriptionChatComponent, DialogModule, TranslateModule],
  template: `<kendo-dialog
    height="97%"
    [title]="'General.AskAi' | translate"
    (close)="closed.emit()"
  >
    <wbs-ai-description-chat
      [models]="models()"
      [description]="description()"
      [startingDialog]="startingDialog()"
      (descriptionChange)="descriptionChange.emit($event)"
    />
  </kendo-dialog> `,
})
export class DescriptionAiDialogComponent {
  readonly startingDialog = input.required<string>();
  readonly description = input.required<string | undefined>();
  readonly models = inject(AiStore).models;

  readonly closed = output<void>();
  readonly descriptionChange = output<string>();
}
