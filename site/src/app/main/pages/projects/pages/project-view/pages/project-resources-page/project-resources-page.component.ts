import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataServiceFactory } from '@wbs/core/data-services';
import { RecordResource } from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { RecordResourcesComponent } from '@wbs/main/components/record-resources/record-resources.component';

@Component({
  standalone: true,
  templateUrl: './project-resources-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecordResourcesComponent, RouterModule],
})
export class ProjectResourcesPageComponent {
  readonly list = signal<RecordResource[]>(this.route.snapshot.data['list']);
  //@Input({ required: true }) list!: RecordResource[];
  @Input({ required: true }) owner!: string;
  @Input({ required: true }) projectId!: string;
  @Input({ required: true }) claims!: string[];

  constructor(
    private readonly data: DataServiceFactory,
    private readonly route: ActivatedRoute
  ) {}

  save(data: Partial<RecordResource>) {
    const list = this.list();
    const resource: RecordResource = {
      id: data.id ?? IdService.generate(),
      createdOn: new Date(),
      lastModified: new Date(),
      name: data.name!,
      description: data.description!,
      type: data.type!,
      resource: data.resource!,

      ownerId: this.owner,
      recordId: this.projectId,
      order: data.order ?? Math.max(...list.map((x) => x.order), 0) + 1,
    };

    this.data.projectResources
      .putAsync(this.owner, this.projectId, resource)
      .subscribe(() => {
        console.log('Saved');

        this.list.set([...list, resource]);
      });
  }
}
