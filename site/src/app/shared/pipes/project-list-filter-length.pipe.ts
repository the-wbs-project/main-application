import { Pipe, PipeTransform } from '@angular/core';
import { ProjectLite, PROJECT_STATI_TYPE } from '@app/models';
import { ProjectListFilterPipe } from './project-list-filter.pipe';

declare type PipeType = ProjectLite[] | undefined | null;

@Pipe({ name: 'projectListFilterLength', pure: false })
export class ProjectListFilterLengthPipe implements PipeTransform {
  transform(list: PipeType, type: PROJECT_STATI_TYPE): number {
    return (ProjectListFilterPipe.transform(list, type) ?? []).length;
  }
}
