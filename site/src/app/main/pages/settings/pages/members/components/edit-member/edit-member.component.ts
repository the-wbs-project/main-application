import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { MemberViewModel } from '@wbs/core/view-models';
import { MetadataState } from '@wbs/main/services';

@Component({
  standalone: true,
  selector: 'wbs-edit-member',
  templateUrl: './edit-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, NgClass, TranslateModule],
})
export class EditMemberComponent {
  readonly save = output<void>();

  readonly member = model.required<MemberViewModel | undefined>();
  readonly roles = inject(MetadataState).roles.definitions;

  toggleRole(role: string): void {
    this.member.update((member) => {
      if (!member) return;

      const index = member.roles.indexOf(role);

      if (index > -1) member.roles.splice(index, 1);
      else member.roles.push(role);

      return member;
    });
  }
}
