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
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';

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
    TextBoxModule,
    TranslateModule,
  ],
})
export class CategoryDialogComponent {
  readonly closed = output<undefined | [string, string]>();

  readonly fas: { [key: string]: IconProp } = {};
  readonly check = faCheck;
  readonly icons = signal(icons);
  readonly titleText = input<string>('General.Add');
  readonly successText = input<string>('General.Add');
  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    icon: new FormControl<string>('Question', [Validators.required]),
  });

  get controls() {
    return this.form.controls;
  }

  close(): void {
    const values = this.form.getRawValue();

    this.closed.emit([values.title!, values.icon!]);
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
