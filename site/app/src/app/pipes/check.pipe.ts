import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'check', standalone: true })
export class CheckPipe implements PipeTransform {
  transform(
    claims: string[] | undefined,
    toCheck: string | string[] | undefined
  ): boolean {
    if (!toCheck) return true;
    if (!claims) return false;

    if (!Array.isArray(toCheck)) toCheck = [toCheck];

    return toCheck.some((claim) => claims.includes(claim));
  }
}
