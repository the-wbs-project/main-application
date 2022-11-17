import { Pipe, PipeTransform } from '@angular/core';
import { TimelineService } from '../services';

@Pipe({ name: 'actionIcon' })
export class ActionIconPipe implements PipeTransform {
  constructor(private readonly service: TimelineService) {}

  transform(actionId: string): string {
    return this.service.getIcon(actionId) ?? '';
  }
}
