import { Pipe, PipeTransform } from '@angular/core';
import { TimelineService } from '@wbs/shared/services';

@Pipe({ name: 'actionDescriptionTransform' })
export class ActionDescriptionTransformPipe implements PipeTransform {
  constructor(private readonly service: TimelineService) {}

  transform(description: string, data: Record<string, any>): string {
    return this.service.transformDescription(description, data);
  }
}
