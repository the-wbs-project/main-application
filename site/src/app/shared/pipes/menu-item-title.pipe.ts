import { Pipe, PipeTransform } from '@angular/core';
import { UiService } from '../services';

@Pipe({ name: 'menuItemTitle', pure: true })
export class MenuItemTitlePipe implements PipeTransform {
  constructor(private readonly service: UiService) {}

  transform(path: string, exact = true): string {
    return this.service.getMenuItemTitle(path, exact) ?? '';
  }
}
