import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faPlus, faTrash } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { LabelModule } from '@progress/kendo-angular-label';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { UserComponent } from '@wbs/components/user';
import { Messages, sorter } from '@wbs/core/services';
import { UserViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'wbs-contributor-dialog',
  templateUrl: './contributor-dialog.component.html',
  host: { class: 'card dashboard-card full-item' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    ButtonModule,
    DialogModule,
    DropDownListModule,
    FontAwesomeModule,
    FormsModule,
    LabelModule,
    TranslateModule,
    UserComponent,
  ],
})
export class ContributorDialogComponent extends DialogContentBase {
  private readonly messages = inject(Messages);

  private readonly members = signal<UserViewModel[]>([]);
  private readonly authorId = signal<string | undefined>(undefined);
  private readonly possibleEditors = computed(() => {
    const editors = this.editors().map((e) => e.userId);

    return this.members()
      .filter(
        (m) => m.userId !== this.authorId() && !editors.includes(m.userId)
      )
      .sort((a, b) => sorter(a.fullName, b.fullName));
  });

  readonly editorToAdd = signal<UserViewModel | null>(null);
  readonly editors = signal<UserViewModel[]>([]);
  readonly editorFilter = signal('');
  readonly filteredPossibleEditors = computed(() => {
    return this.possibleEditors().filter((e) =>
      e.fullName.toLowerCase().includes(this.editorFilter())
    );
  });

  readonly plusIcon = faPlus;
  readonly deleteIcon = faTrash;

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  setup(
    author: UserViewModel,
    editors: UserViewModel[],
    members: UserViewModel[]
  ) {
    this.editors.set(editors.sort((a, b) => sorter(a.fullName, b.fullName)));
    this.authorId.set(author.userId);
    this.members.set(members);
  }

  static launchAsync(
    dialog: DialogService,
    author: UserViewModel,
    editors: UserViewModel[],
    members: UserViewModel[]
  ): Observable<UserViewModel[] | undefined> {
    const ref = dialog.open({
      content: ContributorDialogComponent,
    });
    const comp = ref.content.instance as ContributorDialogComponent;

    comp.editors.set(editors.sort((a, b) => sorter(a.fullName, b.fullName)));
    comp.authorId.set(author.userId);
    comp.members.set(members);

    return ref.result.pipe(
      map((x: unknown) => (x instanceof DialogCloseResult ? undefined : <any>x))
    );
  }

  addEditor(): void {
    const member = this.editorToAdd()!;
    const user: UserViewModel = {
      userId: member.userId,
      fullName: member.fullName,
      email: member.email,
      picture: member.picture,
      roles: [],
    };

    this.editors.update((editors) => {
      if (!editors) return [user];

      return [...editors, user];
    });
    this.editorToAdd.set(null);
  }

  removeEditor(editorId: string): void {
    this.messages.confirm
      .show('General.Confirm', 'Library.RemoveEditorConfirm')
      .subscribe((result) => {
        if (!result) return;

        this.editors.update((editors) => {
          return editors.filter((e) => e.userId !== editorId);
        });
      });
  }
}
