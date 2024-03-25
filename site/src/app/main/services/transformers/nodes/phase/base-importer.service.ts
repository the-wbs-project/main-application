import {
  ProjectCategory,
  ProjectImportResult,
  WbsNode,
} from '@wbs/core/models';
import { IdService } from '@wbs/core/services';

export abstract class BaseImporter {
  protected getChildren(
    parentId: string,
    parentLevel: string,
    people: Map<string, string>,
    nodes: Map<string, ProjectImportResult>
  ): WbsNode[] {
    const results: WbsNode[] = [];
    let counter = 1;

    while (nodes.has(`${parentLevel}.${counter}`)) {
      const level = `${parentLevel}.${counter}`;
      const info = nodes.get(level)!;
      const id = IdService.generate();
      const children = this.getChildren(id, level, people, nodes);
      const now = new Date();
      const node: WbsNode = {
        id,
        parentId,
        order: counter,
        createdOn: now,
        lastModified: now,
        title: info.title,
        disciplineIds: this.getDisciplineFromPeople(info, people),
      };

      results.push(node, ...children);
      counter++;
    }
    return results;
  }

  protected getDisciplineFromPeople(
    info: ProjectImportResult,
    people: Map<string, string>
  ): string[] {
    const ids: string[] = [];

    for (const person of info.resources ?? []) {
      if (!person) continue;

      const id = people.get(person.toLowerCase());

      if (id && ids.indexOf(id) === -1) ids.push(id);
    }
    return ids;
  }

  protected getDisciplines(
    disciplines: ProjectCategory[],
    people: Map<string, ProjectCategory>
  ): ProjectCategory[] {
    const results: ProjectCategory[] = [...disciplines];
    //
    //  Process disciplines
    //
    for (const person of people.keys()) {
      if (person) {
        const discipline = people.get(person)!;
        const index = results.findIndex((x) =>
          typeof x === 'string' ? x === discipline : x.id === discipline
        );
        if (index === -1) results.push(discipline);
      }
    }
    return results;
  }
}
