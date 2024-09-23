import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { AiChatComponent } from '@wbs/components/_utils/ai-chat.component';
import { HeightDirective } from '@wbs/core/directives/height.directive';
import { AiModel } from '@wbs/core/models';
import { AiChatService } from '@wbs/core/services';
import { AiStore } from '@wbs/core/store';
import {
  DescriptionAiChatComponent,
  DescriptionAiEditorComponent,
} from './components';

@Component({
  standalone: true,
  selector: 'wbs-description-ai-dialog',
  templateUrl: './description-ai-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AiChatComponent,
    DescriptionAiChatComponent,
    DescriptionAiEditorComponent,
    DialogModule,
    HeightDirective,
    TabStripModule,
    TranslateModule,
  ],
})
export class DescriptionAiDialogComponent implements OnInit {
  //
  //  Inputs
  //
  readonly description = input.required<string | undefined>();
  readonly startingDialog = input.required<string | undefined>();
  //
  //  Signals
  //
  readonly proposal = signal('');
  readonly containerHeight = signal(0);
  readonly view = signal<'chat' | 'editor'>('chat');
  //
  //  Outputs
  //
  readonly closed = output<void>();
  readonly descriptionChange = output<string>();

  ngOnInit(): void {
    this.proposal.set(this.description() ?? '');
  }

  actionSelected(action: string): void {
    if (action === 'clear') {
      this.proposal.set('');
    } else if (action === 'revert') {
      this.proposal.set(this.description() ?? '');
    } else {
      this.descriptionChange.emit(this.proposal());
    }
  }

  setProposal(message: string, append: boolean): void {
    const current = this.proposal();
    this.proposal.set(
      append && current.length > 0 ? `${current}<br/><br/>${message}` : message
    );
    this.view.set('editor');
  }

  tabChanged(index: number): void {
    this.view.set(index === 0 ? 'chat' : 'editor');
  }
}
