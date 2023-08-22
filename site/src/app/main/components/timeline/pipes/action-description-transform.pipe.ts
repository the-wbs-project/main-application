import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'actionDescriptionTransform', standalone: true })
export class ActionDescriptionTransformPipe implements PipeTransform {
  transform(description: string, data: Record<string, any>): string {
    while (description.indexOf('{') > -1) {
      const start = description.indexOf('{');
      const end = description.indexOf('}', start);
      const property = description.substring(start + 1, end);
      //
      //  If the data doesn't exist, don't show the bad description
      //
      if (data[property] == undefined) return '';

      description = description.replace(`{${property}}`, data[property]);
    }
    return description;
  }
}
