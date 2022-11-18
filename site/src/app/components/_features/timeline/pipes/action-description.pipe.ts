import { Pipe, PipeTransform } from '@angular/core';
import { TimelineService } from '../services';

@Pipe({ name: 'actionDescription' })
export class ActionDescriptionPipe implements PipeTransform {
  constructor(private readonly service: TimelineService) {}

  transform(actionId: string): string {
    return this.service.getDescription(actionId) ?? '';
  }
}
