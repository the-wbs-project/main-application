import { NgClass } from '@angular/common';
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
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TextAreaModule } from '@progress/kendo-angular-inputs';
import { AiModel } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { TaskModalService } from '@wbs/main/services';
import { AiState } from '@wbs/main/states';
import { AlertComponent } from '../alert.component';
import { AiDescriptionChatComponent } from '../ai-description-chat';

@Component({
  standalone: true,
  selector: 'wbs-description-ai-dialog',
  templateUrl: './description-ai-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TaskModalService],
  imports: [
    AiDescriptionChatComponent,
    AlertComponent,
    ButtonModule,
    DialogModule,
    DropDownListModule,
    FormsModule,
    NgClass,
    TextAreaModule,
    TranslateModule,
  ],
})
export class DescriptionAiDialogComponent implements OnInit {
  private readonly store = inject(SignalStore);
  readonly modal = inject(TaskModalService);

  readonly startingDialog = input.required<string>();
  readonly getStartedLabel = input.required<string>();
  readonly description = input.required<string | undefined>();
  readonly showChat = signal<boolean>(false);
  readonly models = this.store.select(AiState.models);
  readonly model = model<AiModel | undefined>();
  readonly startingDialogModel = model<string>();

  readonly closed = output<void>();
  readonly descriptionChange = output<string>();

  ngOnInit(): void {
    this.model.set(this.models()![0]);
    this.startingDialogModel.set(this.startingDialog());
  }

  start(): void {
    this.showChat.set(true);
  }
}
