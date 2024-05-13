import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TextAreaModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { CategoryDialogResults } from '@wbs/core/models';

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
export class CategoryDialogComponent {
  //
  //  IO
  //
  readonly includeIcons = input(true);
  readonly includeDescription = input(true);
  readonly titleText = input<string>('General.Add');
  readonly successText = input<string>('General.Add');
  readonly closed = output<CategoryDialogResults | undefined>();

  readonly check = faCheck;
  readonly icons = signal(icons);
  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    icon: new FormControl<string>('fa-question'),
  });

  get controls() {
    return this.form.controls;
  }

  close(): void {
    const values = this.form.getRawValue();

    this.closed.emit({
      title: values.title!,
      description: values.description ?? undefined,
      icon: values.icon ?? undefined,
    });
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
