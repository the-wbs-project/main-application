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
import { faCheck, fas } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';

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
    ReactiveFormsModule,
    TextBoxModule,
    TranslateModule,
  ],
})
export class CategoryDialogComponent {
  private readonly iconSource = this.createIconList();

  readonly closed = output<undefined | [string, string]>();

  readonly fas = fas;
  readonly check = faCheck;
  readonly icons = signal(this.iconSource);
  readonly titleText = input<string>('General.Add');
  readonly successText = input<string>('General.Add');
  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    icon: new FormControl<string>('faQuestion', [Validators.required]),
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
      this.iconSource.filter(
        (s) => s.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      )
    );
  }

  private createIconList(): { icon: string; name: string }[] {
    return icons
      .sort((a, b) => (a < b ? -1 : 1))
      .map((icon) => ({
        icon,
        name: transform(icon),
      }));
  }
}

const icons: string[] = [
  'faUser',
  'faUserHelmetSafety',
  'faScrewdriverWrench',
  'faGear',
  'faToolbox',
  'faWrench',
  'faShovel',
  'faHelmetSafety',
  'faQuestion',
  'faBuilding',
  'faClipboard',
  'faBuildingColumns',

  'faUserTie',
  'faMap',
  'faChartGantt',
  'faMapPin',
];

function transform(key: string): string {
  const words = key.slice(2).split(/(?=[A-Z])/);

  // Capitalize the first letter of each word
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  // Join the words together with spaces
  return words.join(' ');
}
