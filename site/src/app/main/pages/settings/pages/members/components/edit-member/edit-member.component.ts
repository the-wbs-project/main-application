import { JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Member, ROLES } from '@wbs/core/models';
import { RoleListPipe } from '../../../../../../pipes/role-list.pipe';

@Component({
  standalone: true,
  selector: 'wbs-edit-member',
  templateUrl: './edit-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgFor, NgIf, TranslateModule, RoleListPipe],
})
export class EditMemberComponent implements OnInit {
  readonly roles = [ROLES.PM, ROLES.APPROVER, ROLES.SME, ROLES.ADMIN];

  member?: Member;

  constructor(readonly modal: NgbActiveModal) {}

  ngOnInit(): void {}

  setup(member: Member): void {
    this.member = member;
  }

  toggleRole(role: string): void {
    if (!this.member) return;

    const index = this.member.roles.indexOf(role);

    if (index > -1) this.member.roles.splice(index, 1);
    else this.member.roles.push(role);
  }
}
