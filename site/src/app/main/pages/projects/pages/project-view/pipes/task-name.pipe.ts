import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { TasksState } from '../states';

@Pipe({ name: 'taskName', standalone: true })
export class TaskNamePipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(id: string): string | undefined {
    return this.store.selectSnapshot(TasksState.nodes)?.find((x) => x.id === id)
      ?.title;
  }
}
