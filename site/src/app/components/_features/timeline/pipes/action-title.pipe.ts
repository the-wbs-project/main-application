import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { Resources } from '@wbs/shared/services';
import { TimelineState } from '@wbs/shared/states';

@Pipe({ name: 'actionTitle' })
export class ActionTitlePipe implements PipeTransform {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  transform(actionId: string): string {
    return this.resources.get(
      this.store
        .selectSnapshot(TimelineState.definitions)!
        .find((x) => x.id === actionId)!.title
    );
  }
}
