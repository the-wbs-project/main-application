import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'textTransform', standalone: true })
export class TextTransformPipe implements PipeTransform {
  transform(text: string, data: Record<string, any>): string {
    while (text.indexOf('{') > -1) {
      const start = text.indexOf('{');
      const end = text.indexOf('}', start);
      const propertyWhole = text.substring(start + 1, end);
      const propertyParts = propertyWhole.split(':');
      const property = propertyParts[0];
      const defaultValue = propertyParts[1];

      let value: any = undefined;

      for (const part of property.split('.')) {
        if (value == undefined) {
          value = data[part];
        } else {
          value = value[part];
        }
      }
      //
      //  If the data doesn't exist, don't show the bad description
      //
      if (value == undefined) {
        if (defaultValue != undefined) {
          value = defaultValue;
        } else {
          console.error('cannot find ' + property);
          return '';
        }
      }

      text = text.replace(`{${propertyWhole}}`, value);
    }
    return text;
  }
}
