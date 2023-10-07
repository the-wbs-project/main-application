import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { RecordResource } from '@wbs/core/models';
import { RecordResourcesComponent } from '@wbs/main/components/record-resources/record-resources.component';

@Component({
  standalone: true,
  templateUrl: './project-resources-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecordResourcesComponent],
})
export class ProjectResourcesPageComponent {
  @Input({ required: true }) list!: RecordResource[];
  @Input({ required: true }) owner!: string;
  @Input({ required: true }) projectId!: string;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly data: DataServiceFactory
  ) {}

  save(resource: RecordResource) {
    resource.ownerId = this.owner;
    resource.recordId = this.projectId;

    this.data.projectResources
      .putAsync(this.owner, this.projectId, resource)
      .subscribe(() => {
        console.log('Saved');
        this.list.push(resource);
        this.cd.detectChanges();
      });
  }
}
