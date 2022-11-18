import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'wbs-edit-pencil',
  templateUrl: './edit-pencil.component.html',
  styleUrls: ['./edit-pencil.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EditPencilComponent {
  @Input() placeholder = 'General.Edit';
}
