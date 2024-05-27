import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { MetadataStore } from '@wbs/core/store';
import { MemberViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  standalone: true,
  templateUrl: './edit-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, NgClass, TranslateModule],
})
export class EditMemberComponent extends DialogContentBase {
  readonly member = signal<MemberViewModel | undefined>(undefined);
  readonly roles = inject(MetadataStore).roles.definitions;

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launchAsync(
    dialog: DialogService,
    member: MemberViewModel
  ): Observable<MemberViewModel | undefined> {
    const ref = dialog.open({
      content: EditMemberComponent,
    });
    const component = ref.content.instance as EditMemberComponent;

    component.member.set(member);

    return ref.result.pipe(
      map((x: unknown) =>
        x instanceof DialogCloseResult ? undefined : <MemberViewModel>x
      )
    );
  }

  toggleRole(role: string): void {
    this.member.update((member) => {
      if (!member) return;

      const index = member.roles.indexOf(role);

      if (index > -1) member.roles.splice(index, 1);
      else member.roles.push(role);

      return { ...member };
    });
  }
}
