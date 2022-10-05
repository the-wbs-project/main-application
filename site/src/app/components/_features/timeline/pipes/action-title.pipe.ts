import { Pipe, PipeTransform } from '@angular/core';
import { TimelineService } from '@wbs/shared/services';

@Pipe({ name: 'actionTitle' })
export class ActionTitlePipe implements PipeTransform {
  constructor(private readonly service: TimelineService) {}

  transform(actionId: string): string {
    return this.service.getTitle(actionId) ?? '';
  }
}
