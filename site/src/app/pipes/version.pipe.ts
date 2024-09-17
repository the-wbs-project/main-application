import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'version', standalone: true })
export class VersionPipe implements PipeTransform {
  transform([version, alias]: [number, string | null | undefined]): string {
    let text = `v${version}`;
    if (alias) text += ` - ${alias}`;

    return text;
  }
}
