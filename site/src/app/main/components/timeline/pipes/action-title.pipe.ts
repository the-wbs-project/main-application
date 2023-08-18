import { Pipe, PipeTransform } from '@angular/core';
import { Logger, Resources } from '@wbs/core/services';
import { TimelineService } from '../services';

@Pipe({ name: 'actionTitle', standalone: true })
export class ActionTitlePipe implements PipeTransform {
  constructor(
    private readonly logger: Logger,
    private readonly service: TimelineService,
    private readonly resources: Resources
  ) {}

  transform(actionId: string): string {
    const title = this.service.getTitle(actionId);

    if (!title) {
      this.logger.error('No title found for action ' + actionId);
    }

    console.log(title, this.resources.get(title!));

    return title ?? '';
  }
}
