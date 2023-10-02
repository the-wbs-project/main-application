import { Message } from '@progress/kendo-angular-conversational-ui';
import { AiModel } from '@wbs/core/models';

export class ChangeAiModel {
  static readonly type = '[AI] Change Model';
  constructor(readonly model: AiModel) {}
}

export class SendAiMessage {
  static readonly type = '[AI] Send Message';
  constructor(readonly message: Message) {}
}

export class ClearAiMessages {
  static readonly type = '[AI] Clear Messages';
}
