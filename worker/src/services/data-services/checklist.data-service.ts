import { Context } from '../../config';
import { ChecklistGroup, ChecklistTest } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class ChecklistDataService {
  private db: CosmosDbService;

  constructor(ctx: Context) {
    this.db = new CosmosDbService(ctx, 'Checklists', 'groupId');
  }

  async getAsync(): Promise<ChecklistGroup[]> {
    const list = await this.db.getAllAsync<ChecklistTest>(true);
    const results: ChecklistGroup[] = [];

    for (const obj of list.filter((x) => x.groupId == null).sort(sort)) {
      results.push({
        description: obj.description,
        id: obj.id,
        listOrder: obj.listOrder,
        tests: list.filter((x) => x.groupId === obj.id).sort(sort),
      });
    }
    return results;
  }
}

function sort(a: ChecklistTest, b: ChecklistTest): number {
  return a.listOrder - b.listOrder;
}
