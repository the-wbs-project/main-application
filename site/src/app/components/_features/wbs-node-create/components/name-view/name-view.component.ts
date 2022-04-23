import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NodeCreationState } from '../../state';

@Component({
  selector: 'wbs-node-create-name',
  templateUrl: './name-view.component.html',
  styleUrls: ['./name-view.component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NameViewComponent {
  @Select(NodeCreationState.nodeDescription) description$!: Observable<
    string | undefined
  >;
  @Select(NodeCreationState.nodeName) name$!: Observable<string | undefined>;

  back() {
    //
  }

  go(name: string, description: string) {
    //
  }
}
