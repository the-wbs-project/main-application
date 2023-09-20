import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orgUrl', standalone: true })
export class OrgUrlPipe implements PipeTransform {
  transform(
    fragments: string[] | string | undefined | null,
    org?: string
  ): string[] | string {
    if (!fragments || !org) return '';

    if (Array.isArray(fragments)) {
      for (let i = 0; i < fragments.length; i++) {
        if (fragments[i] === ':orgId') {
          fragments[i] = org;
        }
      }
      return fragments;
    } else {
      return fragments.replace(':orgId', org);
    }
  }
}
