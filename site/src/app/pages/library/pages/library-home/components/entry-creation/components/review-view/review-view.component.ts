import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Category, Phase } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { MetadataStore } from '@wbs/core/store';
import { CategorySelection } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-review-view',
  templateUrl: './review-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ['.row-header { max-width: 200px; }'],
  imports: [TranslateModule],
})
export class ReviewViewComponent {
  private readonly metadata = inject(MetadataStore);
  private readonly resources = inject(Resources);

  readonly versionAlias = input.required<string>();
  readonly templateTitle = input.required<string>();
  readonly mainTaskTitle = input<string>();
  readonly visibility = input.required<string>();
  readonly category = input<Category>();
  readonly phase = input<string | Phase>();
  readonly phases = input<CategorySelection[]>();
  readonly disciplines = input.required<CategorySelection[]>();
  readonly visibilityReview = computed(() => {
    return this.resources.get(
      this.visibility() === 'private' ? 'General.Internal' : 'General.Public'
    );
  });
  readonly disciplineReview = computed(() => {
    const list = this.disciplines().filter((x) => x.selected);

    return list.length === 0
      ? this.resources.get('General.None')
      : list.map((x) => x.label).join(', ');
  });
  readonly phaseReview = computed(() =>
    this.phases()
      ?.filter((x) => x.selected)
      .map((x) => x.label)
      .join(', ')
  );
  readonly phaseLabel = computed(() => {
    const phase = this.phase();

    return !phase
      ? ''
      : typeof phase !== 'string'
      ? phase.label
      : this.metadata.categories.phases.find((x) => x.id === phase)!.label;
  });
}
