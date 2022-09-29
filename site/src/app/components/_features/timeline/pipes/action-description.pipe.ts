import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { Resources } from '@wbs/shared/services';
import { TimelineState } from '@wbs/shared/states';

@Pipe({ name: 'actionDescription' })
export class ActionDescriptionPipe implements PipeTransform {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  transform(actionId: string, data: Record<string, any>): string {
    const label = this.store
      .selectSnapshot(TimelineState.definitions)!
      .find((x) => x.id === actionId)!.description;
    let description = this.resources.get(label);

    if (label === description) return description;

    while (description.indexOf('{') > -1) {
      const start = description.indexOf('{');
      const end = description.indexOf('}', start);
      const property = description.substring(start + 1, end);

      description = description.replace(`{${property}}`, data[property]);
    }
    return description;
  }
}
