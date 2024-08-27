import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faList, faPencil } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { InfoMessageComponent } from '@wbs/components/_utils/info-message.component';
import { SelectButtonComponent } from '@wbs/components/_utils/select-button.component';
import { IdService } from '@wbs/core/services';
import { MetadataStore } from '@wbs/core/store';

@Component({
  standalone: true,
  selector: 'wbs-phase-selection',
  templateUrl: './phase-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonGroupModule,
    ButtonModule,
    AlertComponent,
    FontAwesomeModule,
    InfoMessageComponent,
    LabelModule,
    SelectButtonComponent,
    TextBoxModule,
    TranslateModule,
  ],
  styles: ['.row-header { max-width: 200px; }'],
})
export class PhaseSelectionComponent {
  readonly faList = faList;
  readonly faPencil = faPencil;
  readonly phases = inject(MetadataStore).categories.phases;
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

        return { ...phase };
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
