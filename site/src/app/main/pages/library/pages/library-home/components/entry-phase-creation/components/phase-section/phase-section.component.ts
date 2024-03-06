import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faExclamationTriangle,
  faList,
  faPencil,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { ProjectCategory } from '@wbs/core/models';
import { IdService, SignalStore } from '@wbs/core/services';
import { SelectButtonComponent } from '@wbs/main/components/select-button.component';
import { MetadataState } from '@wbs/main/states';

@Component({
  standalone: true,
  selector: 'wbs-phase-section',
  templateUrl: './phase-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule,
    NgClass,
    SelectButtonComponent,
    TextBoxModule,
    TranslateModule,
  ],
  styles: ['.row-header { max-width: 200px; }'],
})
export class PhaseSectionComponent {
  private readonly store = inject(SignalStore);

  readonly faList = faList;
  readonly faPencil = faPencil;
  readonly faExclamationTriangle = faExclamationTriangle;
  readonly phases = this.store.select(MetadataState.phases);
  readonly phase = model.required<string | { label: string } | undefined>();
  readonly phaseText = computed(() => {
    const phase = this.phase();

    return typeof phase === 'object' ? phase.label : '';
  });
  readonly phaseType = computed(() => {
    const phase = this.phase();

    return typeof phase === 'object' ? 'custom' : 'predefined';
  });

  typeChosen(type: string): void {
    if (this.phaseType() === type) return;

    if (type === 'predefined') {
      this.phase.set(undefined);
    } else {
      this.phase.set({
        label: '',
      });
    }
  }

  predefinedChosen(phase: string): void {
    this.phase.set(phase);
  }

  textChanged(text: string): void {
    this.phase.update((phase) => {
      if (phase && typeof phase === 'object') {
        phase.label = text;

        return phase;
      }
      return {
        id: IdService.generate(),
        label: text,
        order: 1,
        tags: [],
        type: 'phase',
      };
    });
  }
}
