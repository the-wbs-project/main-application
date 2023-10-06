import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'check', standalone: true })
export class CheckPipe implements PipeTransform {
  transform(claims: string[] | undefined, claim: string | undefined): boolean {
    return !claim || (claims ?? []).includes(claim);
  }
}
