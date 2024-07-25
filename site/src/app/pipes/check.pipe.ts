import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '@wbs/core/services';

@Pipe({ name: 'check', standalone: true })
export class CheckPipe implements PipeTransform {
  transform(
    claims: string[] | undefined,
    toCheck: string | string[] | undefined
  ): boolean {
    return Utils.contains(claims, toCheck);
  }
}
