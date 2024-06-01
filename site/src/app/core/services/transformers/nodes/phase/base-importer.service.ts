import { ProjectCategory, WbsImportResult, WbsNode } from '@wbs/core/models';
import { IdService } from '@wbs/core/services';

export abstract class BaseImporter {
  protected getChildren(
    parentId: string,
    parentLevel: string,
    people: Map<string, ProjectCategory>,
    nodes: Map<string, WbsImportResult>
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
    info: WbsImportResult,
    people: Map<string, ProjectCategory>
  ): string[] {
    const ids: string[] = [];

    for (const person of info.resources ?? []) {
      if (!person) continue;

      const discipline = people.get(person.toLowerCase());

      if (discipline && ids.indexOf(discipline.id) === -1)
        ids.push(discipline.id);
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
      if (!person) continue;

      const discipline = people.get(person)!;

      if (!results.find((x) => x.id === discipline.id))
        results.push(discipline);
    }
    return results;
  }
}
