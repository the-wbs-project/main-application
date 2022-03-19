import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { WbsNodeViewModel } from '@app/view-models';

@Component({
  selector: 'wbs-tree',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WbsTreeComponent {
  @Input() nodes: WbsNodeViewModel[] | null | undefined;
  public data: any[] = [
    {
      id: 1,
      name: 'Daryl Sweeney',
      title: 'Chief Executive Officer',
      phone: '(555) 924-9726',
      managerId: null,
    },
    {
      id: 2,
      name: 'Guy Wooten',
      title: 'Chief Technical Officer',
      phone: '(438) 738-4935',
      managerId: 1,
    },
    /*...*/
  ];
}
