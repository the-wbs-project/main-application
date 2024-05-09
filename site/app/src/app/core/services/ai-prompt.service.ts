import { inject } from '@angular/core';
import { MetadataStore } from '@wbs/store';
import { LISTS, LibraryEntry, LibraryEntryVersion, Project } from '../models';
import { WbsNodeView } from '../view-models';
import { sorter } from './sorter.service';

export class AiPromptService {
  private readonly state = inject(MetadataStore);

  libraryEntryDescription(
    entry: LibraryEntry | undefined,
    version: LibraryEntryVersion | undefined,
    tasks: WbsNodeView[] | undefined
  ): string {
    if (!entry || !version) return '';

    let message: string[] = [
      entry.type === 'project'
        ? `Can you provide me with a one paragraph description for a work breakdown structure titled '${version.title}?`
        : `Can you provide me with a one paragraph description for a work breakdown structure ${entry.type} titled '${version.title}?`,
    ];

    const subTasks = (tasks ?? []).filter((t) => t.parentId == undefined);

    if (subTasks.length > 0) {
      message.push(
        entry.type == 'project'
          ? 'The phase(s) for this project are:'
          : entry.type === 'phase'
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
    entry: LibraryEntry | undefined,
    version: LibraryEntryVersion | undefined,
    taskId: string | undefined,
    tasks: WbsNodeView[] | undefined
  ): string {
    if (!entry || !version || !taskId) return '';

    const task = tasks?.find((t) => t.id === taskId);

    if (!task) return '';

    let type =
      entry.type === 'project' && task.parentId == null ? 'phase' : 'task';
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
    project: Project | undefined,
    tasks: WbsNodeView[] | undefined
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
    project: Project | undefined,
    taskId: string | undefined,
    tasks: WbsNodeView[] | undefined
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
