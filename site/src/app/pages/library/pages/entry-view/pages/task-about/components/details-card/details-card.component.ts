import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryEntry } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';

@Component({
  standalone: true,
  selector: 'wbs-task-details-card',
  templateUrl: './details-card.component.html',
  host: { class: 'card dashboard-card' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateTextPipe, RouterModule, TranslateModule],
})
export class DetailsCardComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);

  readonly entry = input.required<LibraryEntry>();
  readonly task = input.required<WbsNodeView>();

  readonly owner = signal<string>('');

  ngOnInit(): void {
    this.data.organizations
      .getNameAsync(this.entry().owner)
      .subscribe((name) => this.owner.set(name));
  }
}
