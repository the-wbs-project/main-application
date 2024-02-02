import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ResourceRecord } from '@wbs/core/models';
import { RecordResourcesPageComponent } from '@wbs/main/components/record-resources-page/record-resources-page.component';

@Component({
  standalone: true,
  template: `<wbs-record-resources-page
    [list]="list()"
    [owner]="owner()"
    [claims]="claims()"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecordResourcesPageComponent],
})
export class ResourcesPageComponent {
  readonly list = input.required<ResourceRecord[]>();
  readonly owner = input.required<string>();
  readonly entryId = input.required<string>();
  readonly claims = input.required<string[]>();
}
