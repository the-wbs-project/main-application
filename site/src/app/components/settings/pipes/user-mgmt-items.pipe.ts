import { Pipe, PipeTransform } from '@angular/core';
import { faCheck, faEye, faX } from '@fortawesome/pro-solid-svg-icons';
import { MenuItem } from '@wbs/shared/models';
import { UserViewModel } from '../models';

@Pipe({ name: 'userMgmtItems', pure: false })
export class UserMgmtItemsPipe implements PipeTransform {
  transform(user: UserViewModel): MenuItem[] {
    const items: MenuItem[] = [
      {
        id: 'view',
        title: 'Settings.ViewUserDetails',
        icon: faEye,
      },
    ];

    if (user.isActive) {
      items.push({
        id: 'deactivate',
        title: 'Settings.DeactivateUser',
        icon: faX,
      });
    } else {
      items.push({
        id: 'activate',
        title: 'Settings.ActivateUser',
        icon: faCheck,
      });
    }

    return items;
  }
}
