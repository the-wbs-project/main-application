import { Pipe, PipeTransform } from '@angular/core';
import { MenuItem } from '@wbs/core/models';
import { User } from '../models';

@Pipe({ name: 'userMgmtItems', pure: false, standalone: true })
export class UserMgmtItemsPipe implements PipeTransform {
  transform(user: User): MenuItem[] {
    const items: MenuItem[] = [
      {
        id: 'view',
        title: 'Settings.ViewUserDetails',
        icon: 'fa-eye',
      },
    ];

    if (user.isActive) {
      items.push({
        id: 'deactivate',
        title: 'Settings.DeactivateUser',
        icon: 'fa-x',
      });
    } else {
      items.push({
        id: 'activate',
        title: 'Settings.ActivateUser',
        icon: 'fa-check',
      });
    }

    return items;
  }
}
