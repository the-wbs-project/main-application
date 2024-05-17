import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TextAreaModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

declare type Icon = { icon: string; name: string };

@Component({
  standalone: true,
  selector: 'wbs-category-dialog',
  templateUrl: './category-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    DropDownListModule,
    FontAwesomeModule,
    LabelModule,
    NgClass,
    ReactiveFormsModule,
    TextAreaModule,
    TextBoxModule,
    TranslateModule,
  ],
})
export class CategoryDialogComponent extends DialogContentBase {
  readonly includeIcons = signal(true);
  readonly includeDescription = signal(true);
  readonly titleText = signal<string>('General.Add');
  readonly successText = signal<string>('General.Add');

  readonly check = faCheck;
  readonly icons = signal(icons);
  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    icon: new FormControl<string>('fa-question'),
  });

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  get controls() {
    return this.form.controls;
  }

  close(): void {
    const values = this.form.getRawValue();

    this.dialog.close({
      title: values.title!,
      description: values.description ?? undefined,
      icon: values.icon ?? undefined,
    });
  }

  static launchAsync(
    dialog: DialogService,
    includeDescription: boolean,
    includeIcons: boolean,
    titleText?: string,
    successText?: string
  ): Observable<any | undefined> {
    const ref = dialog.open({
      content: CategoryDialogComponent,
    });
    const component = ref.content.instance as CategoryDialogComponent;

    component.includeDescription.set(includeDescription);
    component.includeIcons.set(includeIcons);
    component.titleText.set(titleText ?? 'General.Add');
    component.successText.set(successText ?? 'General.Add');

    return ref.result.pipe(
      map((x: unknown) => (x instanceof DialogCloseResult ? undefined : <any>x))
    );
  }

  protected handleIconFilter(value: string) {
    this.icons.set(
      icons.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      )
    );
  }
}

const icons: Icon[] = [
  { icon: 'fa-user', name: 'User' },
  { icon: 'fa-user-helmet-safety', name: 'User Helmet Safety' },
  { icon: 'fa-screwdriver-wrench', name: 'Screwdriver Wrench' },
  { icon: 'fa-gear', name: 'Gear' },
  { icon: 'fa-toolbox', name: 'Toolbox' },
  { icon: 'fa-wrench', name: 'Wrench' },
  { icon: 'fa-shovel', name: 'Shovel' },
  { icon: 'fa-helmet-safety', name: 'Helmet Safety' },
  { icon: 'fa-question', name: 'Question' },
  { icon: 'fa-building', name: 'Building' },
  { icon: 'fa-clipboard', name: 'Clipboard' },
  { icon: 'fa-building-columns', name: 'Building Columns' },
  { icon: 'fa-user-tie', name: 'User Tie' },
  { icon: 'fa-map', name: 'Map' },
  { icon: 'fa-chart-gantt', name: 'Chart Gantt' },
  { icon: 'fa-map-pin', name: 'Map Pin' },
];
