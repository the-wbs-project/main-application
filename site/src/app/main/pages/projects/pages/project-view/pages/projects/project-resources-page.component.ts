import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ResourceRecord } from '@wbs/core/models';
import { RecordResourcesPageComponent } from '@wbs/main/components/record-resources-page/record-resources-page.component';

@Component({
  standalone: true,
  template: `<wbs-record-resources-page
    [list]="list"
    [owner]="owner"
    [projectId]="projectId"
    [claims]="claims"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecordResourcesPageComponent],
})
export class ProjectResourcesPageComponent {
  @Input({ required: true }) list!: ResourceRecord[];
  @Input({ required: true }) owner!: string;
  @Input({ required: true }) projectId!: string;
  @Input({ required: true }) claims!: string[];
}
