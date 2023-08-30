import { Context } from '../../config';
import { Activity, Project } from '../../models';
import { OriginService } from '../origin.service';
import { CosmosDbService } from './cosmos-db.service';

export class ActivityDataService {
  private readonly db: CosmosDbService;

  constructor(private readonly ctx: Context) {
    this.db = new CosmosDbService(ctx, 'Activity', 'topLevelId');
  }

  private getByTopLevelAsync(topLevelId: string, skip: number, take: number): Promise<Activity[] | undefined> {
    return this.db.getListByQueryAsync<Activity>(
      'SELECT * FROM c WHERE c.topLevelId = @TopLevelId ORDER BY c.timestamp desc',
      true,
      [
        {
          name: '@TopLevelId',
          value: topLevelId,
        },
      ],
      skip,
      take,
      true,
    );
  }

  async migrateAsync(): Promise<void> {
    const owner = 'acme_engineering';
    const projectDb = new CosmosDbService(this.ctx, 'Projects', 'id');
    const projects = await projectDb.getAllByPartitionAsync<Project>(owner, true);
    const origin = new OriginService(this.ctx);
    const objects: Activity[] = [];
    var i = 0;

    for (const project of projects ?? []) {
      console.log(project.id);
      let page = 1;
      let cont = true;

      while (cont) {
        const activities = await this.getByTopLevelAsync(project.id, 0, 3000);

        console.log(page, activities?.length);

        cont = activities?.length === 3000;

        page++;

        objects.push(...(activities ?? []));
      }
    }

    console.log('Saving ' + objects.length);

    const save: Activity[] = [];

    for (const act of objects) {
      //@ts-ignore
      act.timestamp = new Date(act.timestamp);

      save.push(act);

      if (save.length === 25) {
        const call = await origin.putAsync(`activities`, save);

        if (call.status > 204) {
          console.log(call.status, await call.text());
          return;
        }

        i += 25;
        save.length = 0;
        console.log(i);
      }
    }
    if (objects.length > 0) {
      i += objects.length;
      const call = await origin.putAsync(`activities`, objects);

      if (call.status > 204) {
        console.log(call.status, await call.text());
        return;
      }
    }
  }
}
