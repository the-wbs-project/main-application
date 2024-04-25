import { Pipe, PipeTransform } from '@angular/core';
import { Resources } from '@wbs/core/services';

@Pipe({ name: 'translateList', standalone: true })
export class TranslateListPipe implements PipeTransform {
  constructor(private readonly resources: Resources) {}

  transform(
    labels: (string | Record<string, string>)[],
    textField?: string
  ): string {
    if (!labels) return '';

    const list: string[] = [];

    for (const possibleLabel of labels) {
      const label =
        typeof possibleLabel === 'string'
          ? possibleLabel
          : possibleLabel[textField!];

      list.push(this.resources.get(label));
    }
    return list.join(', ');
  }
}
