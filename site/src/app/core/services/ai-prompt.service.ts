import { inject } from '@angular/core';
import { MetadataStore } from '@wbs/core/store';
import { LISTS } from '../models';
import {
  LibraryVersionViewModel,
  ProjectViewModel,
  TaskViewModel,
} from '../view-models';
import { sorter } from './sorter.service';

export class AiPromptService {
  private readonly state = inject(MetadataStore);

  libraryEntryDescription(
    version: LibraryVersionViewModel | undefined,
    tasks: TaskViewModel[] | undefined
  ): string {
    if (!version) return '';

    let message: string[] = [
      version.type === 'project'
        ? `Can you provide me with a one paragraph description for a work breakdown structure titled '${version.title}?`
        : `Can you provide me with a one paragraph description for a work breakdown structure ${version.type} titled '${version.title}?`,
    ];

    const subTasks = (tasks ?? []).filter((t) => t.parentId == undefined);

    if (subTasks.length > 0) {
      message.push(
        version.type == 'project'
          ? 'The phase(s) for this project are:'
          : version.type === 'phase'
          ? 'The immediate sub-task(s) for this phase are:'
          : 'The immediate sub-task(s) for this task are:'
      );
      message.push(
        subTasks
          .sort((a, b) => sorter(a.order, b.order))
          .map((t) => `'${t.title}'`)
          .join(', ')
      );
    }

    return message.join(' ');
  }

  libraryEntryTaskDescription(
    version: LibraryVersionViewModel | undefined,
    taskId: string | undefined,
    tasks: TaskViewModel[] | undefined
  ): string {
    if (!version || !taskId) return '';

    const task = tasks?.find((t) => t.id === taskId);

    if (!task) return '';

    let type =
      version.type === 'project' && task.parentId == null ? 'phase' : 'task';
    let message: string[] = [
      `Can you provide me with a one paragraph description for a ${type} titled '${task.title}?`,
    ];

    if (task.parentId != null) {
      message.push(`The level for this task is ${task.levelText}.`);

      const parents: string[] = [];

      let currentParent = tasks?.find((t) => t.id === task.parentId);

      while (currentParent) {
        parents.push(`${currentParent.levelText}. '${currentParent.title}'`);
        currentParent = tasks?.find((t) => t.id === currentParent?.parentId);
      }
      message.push(
        `The parent task(s) for this task are: ${parents.join(', ')}`
      );
    }

    const subTasks = (tasks ?? []).filter((t) => t.parentId == undefined);

    if (subTasks.length > 0) {
      message.push(`The immediate sub-task(s) for this ${type} are:`);
      message.push(
        subTasks
          .sort((a, b) => sorter(a.order, b.order))
          .map((t) => `'${t.title}'`)
          .join(', ')
      );
    }

    return message.join(' ');
  }

  projectDescription(
    project: ProjectViewModel | undefined,
    tasks: TaskViewModel[] | undefined
  ): string {
    if (!project) return '';

    const category =
      this.state.categories.getName(
        LISTS.PROJECT_CATEGORIES,
        project.category
      ) ?? '';
    let message: string[] = [
      `Can you provide me with a one paragraph description for a ${category} project titled '${project.title}?`,
    ];

    const subTasks = (tasks ?? []).filter((t) => t.parentId == undefined);

    if (subTasks.length > 0) {
      message.push('The phase(s) for this project are:');
      message.push(
        subTasks
          .sort((a, b) => sorter(a.order, b.order))
          .map((t) => `'${t.title}'`)
          .join(', ')
      );
    }

    return message.join(' ');
  }

  projectTaskDescription(
    project: ProjectViewModel | undefined,
    taskId: string | undefined,
    tasks: TaskViewModel[] | undefined
  ): string {
    if (!project || !taskId) return '';

    const task = tasks?.find((t) => t.id === taskId);

    if (!task) return '';

    let type = task.parentId == null ? 'phase' : 'task';
    let message: string[] = [
      `Can you provide me with a one paragraph description for a ${type} titled '${task.title}?`,
    ];

    if (task.parentId != null) {
      message.push(`The level for this task is ${task.levelText}.`);

      const parents: string[] = [];

      let currentParent = tasks?.find((t) => t.id === task.parentId);

      while (currentParent) {
        parents.push(`${currentParent.levelText}. '${currentParent.title}'`);
        currentParent = tasks?.find((t) => t.id === currentParent?.parentId);
      }
      message.push(
        `The parent task(s) for this task are: ${parents.join(', ')}`
      );
    }

    const subTasks = (tasks ?? []).filter((t) => t.parentId == undefined);

    if (subTasks.length > 0) {
      message.push(`The immediate sub-task(s) for this ${type} are:`);
      message.push(
        subTasks
          .sort((a, b) => sorter(a.order, b.order))
          .map((t) => `'${t.title}'`)
          .join(', ')
      );
      message.push(
        'Do not mention or discuss the sub-tasks in the description directly, they were only provided to give context.'
      );
    }

    return message.join(' ');
  }
}
