import { Pipe, PipeTransform } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faQuestion } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { RoleState } from '@wbs/main/states';

@Pipe({ name: 'roleIcon', standalone: true })
export class RoleIconPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  transform(role: string, defaultIcon = faQuestion): IconDefinition {
    return (
      this.store
        .selectSnapshot(RoleState.definitions)!
        .find((r) => r.id === role)?.icon ?? defaultIcon
    );
  }
}
