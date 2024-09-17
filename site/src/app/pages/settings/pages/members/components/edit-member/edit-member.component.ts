import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { Role } from '@wbs/core/models';
import { MetadataStore } from '@wbs/core/store';
import { UserViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  standalone: true,
  templateUrl: './edit-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonGroupModule,
    ButtonModule,
    DialogModule,
    NgClass,
    TranslateModule,
  ],
})
export class EditMemberComponent extends DialogContentBase {
  readonly member = signal<UserViewModel | undefined>(undefined);
  readonly roles = inject(MetadataStore).roles.definitions;

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launchAsync(
    dialog: DialogService,
    member: UserViewModel
  ): Observable<UserViewModel | undefined> {
    const ref = dialog.open({
      content: EditMemberComponent,
    });
    const component = ref.content.instance as EditMemberComponent;

    component.member.set(member);

    return ref.result.pipe(
      map((x: unknown) =>
        x instanceof DialogCloseResult ? undefined : <UserViewModel>x
      )
    );
  }

  doesUserHaveRole(member: UserViewModel, role: Role): boolean {
    return member.roles.some((r) => r.id === role.id);
  }

  toggleRole(member: UserViewModel, role: Role): void {
    const index = member.roles.map((x) => x.id).indexOf(role.id);

    if (index > -1) member.roles.splice(index, 1);
    else member.roles = [...member.roles, role];
  }
}
