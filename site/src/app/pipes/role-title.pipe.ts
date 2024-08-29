import { inject, Pipe, PipeTransform } from '@angular/core';
import { MetadataStore } from '@wbs/core/store';

@Pipe({ name: 'roleTitle', standalone: true })
export class RoleTitlePipe implements PipeTransform {
  private readonly metadata = inject(MetadataStore);

  transform(role: string): string {
    return (
      this.metadata.roles.definitions.find(
        (x) => x.id === role || x.name === role
      )?.description ?? 'Unknown'
    );
  }
}
