import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faListTree, faPeopleGroup } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { NodeViewChosen } from '../../actions';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  standalone: true,
  selector: 'wbs-project-create-node-view',
  templateUrl: './node-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FooterComponent, TranslateModule],
})
export class NodeViewComponent {
  readonly faListTree = faListTree;
  readonly faPeopleGroup = faPeopleGroup;

  constructor(private readonly store: Store) {}

  phase(): void {
    this.store.dispatch(new NodeViewChosen(PROJECT_NODE_VIEW.PHASE));
  }

  discipline(): void {
    this.store.dispatch(new NodeViewChosen(PROJECT_NODE_VIEW.DISCIPLINE));
  }
}
