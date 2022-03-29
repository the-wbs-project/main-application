import { Pipe, PipeTransform } from '@angular/core';
import { ProjectLite, PROJECT_STATI_TYPE } from '@wbs/models';

declare type PipeType = ProjectLite[] | undefined | null;

@Pipe({ name: 'projectListFilter', pure: false })
export class ProjectListFilterPipe implements PipeTransform {
  static transform(list: PipeType, type: PROJECT_STATI_TYPE): PipeType {
    if (list == null || list.length === 0) return list;

    return list.filter((x) => x.status === type);
  }

  transform(list: PipeType, type: PROJECT_STATI_TYPE): PipeType {
    return ProjectListFilterPipe.transform(list, type);
  }
}
