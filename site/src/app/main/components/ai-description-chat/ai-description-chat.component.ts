import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  model,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faArrowRotateBack,
  faEraser,
  faThumbsUp,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { EditorModule } from '@progress/kendo-angular-editor';
import { AiChatComponent } from '@wbs/components/ai-chat.component';
import { AiModel } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-ai-description-chat',
  templateUrl: './ai-description-chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AiChatComponent,
    ButtonModule,
    EditorModule,
    FontAwesomeModule,
    NgClass,
    TranslateModule,
  ],
})
export class AiDescriptionChatComponent implements OnInit {
  readonly model = input.required<AiModel>();
  readonly description = input.required<string | undefined>();
  readonly startingDialog = input.required<string | undefined>();

  readonly back = output<void>();
  readonly descriptionChange = output<string>();

  readonly faArrowLeft = faArrowLeft;
  readonly faEraser = faEraser;
  readonly faArrowRotateBack = faArrowRotateBack;
  readonly faThumbsUp = faThumbsUp;
  readonly actions = [
    {
      type: 'action',
      title: 'Append',
      value: 'append',
    },
    {
      type: 'action',
      title: 'Set/Replace',
      value: 'set',
    },
  ];

  proposal = model('');

  ngOnInit(): void {
    this.proposal.set(this.description() ?? '');
  }

  revert(): void {
    this.proposal.set(this.description() ?? '');
  }

  setProposal(action: string, message: string): void {
    const append = action === 'append';
    const current = this.proposal();
    this.proposal.set(
      append && current.length > 0 ? `${current}<br/><br/>${message}` : message
    );
  }
}
