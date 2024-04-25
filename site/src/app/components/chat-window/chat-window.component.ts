import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBoltLightning } from '@fortawesome/pro-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import {
  ButtonModule,
  DropDownButtonModule,
} from '@progress/kendo-angular-buttons';
import {
  ChatModule,
  SendMessageEvent,
} from '@progress/kendo-angular-conversational-ui';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { ExpansionPanelModule } from '@progress/kendo-angular-layout';
import { arrowDownIcon, arrowUpIcon } from '@progress/kendo-svg-icons';
import { AiModel } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import {
  ChangeAiModel,
  ClearAiMessages,
  SendAiMessage,
} from '@wbs/main/actions';
import { TranslateListPipe } from '@wbs/pipes/translate-list.pipe';
import { AiState } from '@wbs/main/states';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'wbs-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ButtonModule,
    ChatModule,
    DropDownButtonModule,
    DropDownListModule,
    ExpansionPanelModule,
    FontAwesomeModule,
    FormsModule,
    NgIf,
    TranslateListPipe,
    TranslateModule,
  ],
})
export class ChatWindowComponent implements OnInit {
  readonly bot = toSignal(this.store.select(AiState.bot));
  readonly you = toSignal(this.store.select(AiState.you));
  readonly feed = toSignal(this.store.select(AiState.feed));
  readonly models = toSignal(this.store.select(AiState.models));
  readonly iconUp = arrowUpIcon;
  readonly iconDown = arrowDownIcon;
  readonly iconBolt = faBoltLightning;
  model?: AiModel;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly messages: Messages,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.store
      .select(AiState.feed)
      .pipe(untilDestroyed(this))
      .subscribe(() => this.cd.detectChanges());

    this.store
      .select(AiState.model)
      .pipe(untilDestroyed(this))
      .subscribe((model) => {
        this.model = model;
        this.cd.detectChanges();
      });
  }

  changeModel(model: AiModel): void {
    console.log(model);
    this.store.dispatch(new ChangeAiModel(model));
  }

  sendMessage(e: SendMessageEvent): void {
    this.store.dispatch(new SendAiMessage(e.message));
  }

  clear(): void {
    this.messages.confirm
      .show('General.Confirm', 'AI.ClearConfirm')
      .subscribe((result) => {
        if (result) {
          this.store.dispatch(new ClearAiMessages());
        }
      });
  }
}
