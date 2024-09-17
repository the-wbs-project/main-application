import { inject, Pipe, PipeTransform } from '@angular/core';
import { ProjectStore } from '../stores';

@Pipe({ name: 'taskName', standalone: true })
export class TaskNamePipe implements PipeTransform {
  private readonly store = inject(ProjectStore);

  transform(id: string): string | undefined {
    return this.store.tasks()?.find((x) => x.id === id)?.title;
  }
}
