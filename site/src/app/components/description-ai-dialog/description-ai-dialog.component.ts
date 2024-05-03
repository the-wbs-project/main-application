import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { AiDescriptionChatComponent } from '@wbs/components/ai-description-chat';
import { TaskModalService } from '@wbs/main/services';
import { AiStore } from '@wbs/store';

@Component({
  standalone: true,
  selector: 'wbs-description-ai-dialog',
  templateUrl: './description-ai-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TaskModalService],
  imports: [AiDescriptionChatComponent, DialogModule, TranslateModule],
})
export class DescriptionAiDialogComponent implements OnInit {
  readonly modal = inject(TaskModalService);

  readonly startingDialog = input.required<string>();
  readonly getStartedLabel = input.required<string>();
  readonly description = input.required<string | undefined>();
  //readonly object = input.required<any>();
  readonly showChat = signal<boolean>(false);
  readonly models = inject(AiStore).models;
  readonly startingDialogModel = model<string>();

  readonly closed = output<void>();
  readonly descriptionChange = output<string>();

  ngOnInit(): void {
    this.startingDialogModel.set(this.startingDialog());
  }
}
