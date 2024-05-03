import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  model,
} from '@angular/core';
import { faBoltLightning } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  ChatModule,
  SendMessageEvent,
} from '@progress/kendo-angular-conversational-ui';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { ExpansionPanelModule } from '@progress/kendo-angular-layout';
import { arrowDownIcon, arrowUpIcon } from '@progress/kendo-svg-icons';
import { AiModel } from '@wbs/core/models';
import { AiChatService, Messages } from '@wbs/core/services';
import { AiStore } from '@wbs/store';

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
    DropDownListModule,
    ExpansionPanelModule,
    TranslateModule,
  ],
})
export class ChatWindowComponent implements OnInit {
  readonly store = inject(AiStore);
  readonly service = inject(AiChatService);
  readonly iconUp = arrowUpIcon;
  readonly iconDown = arrowDownIcon;
  readonly iconBolt = faBoltLightning;
  readonly model = model<AiModel>();

  constructor(private readonly messages: Messages) {}

  ngOnInit(): void {
    this.changeModel(this.store.model()!);
  }

  changeModel(model: AiModel): void {
    this.model.set(model);
    this.service.start(model);
  }

  sendMessage(e: SendMessageEvent): void {
    this.service.send(e.message);
  }

  clear(): void {
    this.messages.confirm
      .show('General.Confirm', 'AI.ClearConfirm')
      .subscribe((result) => {
        if (result) {
          this.service.reset();
        }
      });
  }
}
