import { Pipe, PipeTransform } from '@angular/core';
import { TimelineService } from '../services';

@Pipe({ name: 'actionDescription', standalone: true })
export class ActionDescriptionPipe implements PipeTransform {
  constructor(private readonly service: TimelineService) {}

  transform(actionId: string): string {
    return this.service.getDescription(actionId) ?? '';
  }
}
