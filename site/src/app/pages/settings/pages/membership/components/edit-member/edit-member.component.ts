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
import { Role, User } from '@wbs/core/models';
import { MetadataStore } from '@wbs/core/store';
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
  readonly member = signal<User | undefined>(undefined);
  readonly roles = inject(MetadataStore).roles.definitions;

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launchAsync(
    dialog: DialogService,
    member: User
  ): Observable<User | undefined> {
    const ref = dialog.open({
      content: EditMemberComponent,
    });
    const component = ref.content.instance as EditMemberComponent;

    component.member.set(member);

    return ref.result.pipe(
      map((x: unknown) =>
        x instanceof DialogCloseResult ? undefined : <User>x
      )
    );
  }

  doesUserHaveRole(member: User, role: Role): boolean {
    return member.roles.some((r) => r === role.id);
  }

  toggleRole(member: User, role: Role): void {
    const index = member.roles.indexOf(role.id);

    if (index > -1) member.roles.splice(index, 1);
    else member.roles = [...member.roles, role.id];
  }
}
