import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faFloppyDisk,
  faInfoCircle,
  faPlus,
  faRobot,
  faTrash,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { AiButtonComponent } from '@wbs/components/_utils/ai-button.component';
import { FadingMessageComponent } from '@wbs/components/_utils/fading-message.component';
import { InfoMessageComponent } from '@wbs/components/_utils/info-message.component';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { VisibilitySelectionComponent } from '@wbs/components/_utils/visiblity-selection';
import { DescriptionAiDialogComponent } from '@wbs/components/description-ai-dialog';
import { ProjectCategoryDropdownComponent } from '@wbs/components/project-category-dropdown';
import { UserComponent } from '@wbs/components/user';
import { DataServiceFactory } from '@wbs/core/data-services';
import { DirtyComponent, Member } from '@wbs/core/models';
import { Messages, SaveService, sorter } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { EntryStore } from '@wbs/core/store';
import { LibraryVersionViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  templateUrl: './general-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AiButtonComponent,
    ButtonModule,
    DescriptionAiDialogComponent,
    DropDownListModule,
    EditorModule,
    FadingMessageComponent,
    FontAwesomeModule,
    FormsModule,
    InfoMessageComponent,
    LabelModule,
    NgClass,
    ProjectCategoryDropdownComponent,
    SaveButtonComponent,
    TextBoxModule,
    TranslateModule,
    UserComponent,
    VisibilitySelectionComponent,
  ],
})
export class GeneralComponent implements DirtyComponent, OnInit {
  private readonly data = inject(DataServiceFactory);
  private readonly messages = inject(Messages);
  private readonly service = inject(EntryService);
  private readonly members = signal<Member[]>([]);

  readonly entryStore = inject(EntryStore);
  readonly saveIcon = faFloppyDisk;
  readonly checkIcon = faCheck;
  readonly aiIcon = faRobot;
  readonly infoIcon = faInfoCircle;
  readonly plusIcon = faPlus;
  readonly deleteIcon = faTrash;
  readonly askAi = model(true);
  readonly editorFilter = signal('');
  readonly editorToAdd = signal<Member | null>(null);
  readonly version = signal<LibraryVersionViewModel | null>(null);
  readonly showSaveReminder = signal(false);
  readonly canSave = computed(() => {
    const version = this.version();

    if ((version?.title ?? '').length === 0) return false;

    return true;
  });
  readonly isDirty = signal(false);
  readonly saved = new SaveService();
  readonly descriptionAiStartingDialog = computed(() => {
    return `Can you provide me with a one paragraph description of a phase of a work breakdown structure titled '${
      this.version()?.title
    }'?`;
  });
  readonly possibleEditors = computed(() => {
    const version = this.version();

    if (!version) return [];

    const editors = version.editors?.map((e) => e.userId) ?? [];

    return this.members()
      .filter(
        (m) =>
          m.user_id !== version.author.userId && !editors.includes(m.user_id)
      )
      .sort((a, b) => sorter(a.name, b.name));
  });
  readonly filteredPossibleEditors = computed(() => {
    return this.possibleEditors().filter((e) =>
      e.name.toLowerCase().includes(this.editorFilter())
    );
  });

  ngOnInit(): void {
    const version = this.entryStore.version()!;

    this.version.set(version);
    this.data.memberships
      .getMembershipUsersAsync(version.ownerId)
      .subscribe((users) => this.members.set(users));
  }

  save(): void {
    this.saved.call(this.service.saveAsync(this.version()!)).subscribe();
  }

  addEditor(): void {
    const user = this.editorToAdd()!;

    this.version.update((version) => {
      if (!version) return version;

      if (!version.editors) version.editors = [];

      version.editors.push({
        userId: user.user_id,
        fullName: user.name,
        email: user.email,
        roles: [],
      });
      return { ...version };
    });
    this.editorToAdd.set(null);
    this.showSaveReminder.set(true);
  }

  removeEditor(editorId: string): void {
    this.messages.confirm
      .show('General.Confirm', 'Library.RemoveEditorConfirm')
      .subscribe((result) => {
        if (!result) return;

        this.version.update((version) => {
          if (!version) return version;

          return {
            ...version,
            editors: version.editors.filter((e) => e.userId !== editorId),
          };
        });
      });
  }
}
