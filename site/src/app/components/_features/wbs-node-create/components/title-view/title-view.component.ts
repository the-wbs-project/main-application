import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TitleDescriptionNext, TitleDescriptionPrevious } from '../../actions';
import { NodeCreationState } from '../../state';

@Component({
  selector: 'wbs-node-create-title',
  templateUrl: './title-view.component.html',
  styleUrls: ['../flexing.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TitleViewComponent {
  @Select(NodeCreationState.description) description$!: Observable<string>;
  @Select(NodeCreationState.title) title$!: Observable<string>;

  constructor(private readonly store: Store) {}

  back() {
    this.store.dispatch(new TitleDescriptionPrevious());
  }

  go(title: string, description: string) {
    this.store.dispatch(new TitleDescriptionNext(title, description));
  }
}
