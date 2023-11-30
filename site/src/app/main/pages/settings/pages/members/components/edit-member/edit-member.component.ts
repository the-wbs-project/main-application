import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Member, Role } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-edit-member',
  templateUrl: './edit-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TranslateModule],
})
export class EditMemberComponent {
  member?: Member;
  roles?: Role[];

  constructor(readonly modal: NgbActiveModal) {}

  setup({ member, roles }: { member: Member; roles: Role[] }): void {
    this.member = member;
    this.roles = roles;
  }

  toggleRole(role: string): void {
    if (!this.member) return;

    const index = this.member.roles.indexOf(role);

    if (index > -1) this.member.roles.splice(index, 1);
    else this.member.roles.push(role);
  }
}
