import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'textTransform', standalone: true })
export class TextTransformPipe implements PipeTransform {
  transform(text: string, data: Record<string, any>): string {
    while (text.indexOf('{') > -1) {
      const start = text.indexOf('{');
      const end = text.indexOf('}', start);
      const property = text.substring(start + 1, end);
      //
      //  If the data doesn't exist, don't show the bad description
      //
      if (data[property] == undefined) {
        console.error('cannot find ' + property);
        return '';
      }

      text = text.replace(`{${property}}`, data[property]);
    }
    return text;
  }
}
