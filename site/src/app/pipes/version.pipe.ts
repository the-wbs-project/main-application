import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'version', standalone: true })
export class VersionPipe implements PipeTransform {
  transform([version, alias]: [number, string | null | undefined]): string {
    if (alias) return `${alias} (v${version})`;

    return `v${version}`;
  }
}
