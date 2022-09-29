import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { TimelineState } from '@wbs/shared/states';

@Pipe({ name: 'actionIcon' })
export class ActionIconPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(actionId: string): string {
    return this.store
      .selectSnapshot(TimelineState.definitions)!
      .find((x) => x.id === actionId)!.icon;
  }
}
