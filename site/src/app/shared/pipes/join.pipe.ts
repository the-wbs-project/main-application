import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'join', pure: false })
export class JoinPipe implements PipeTransform {
  transform(list: any[] | undefined | null, prop?: string): string {
    const results: string[] = [];

    for (const x of list ?? []) {
      if (prop) results.push(x[prop]);
      else results.push(x);
    }

    return results.join(', ');
  }
}
