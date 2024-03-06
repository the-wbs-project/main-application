import {
  Project,
  ProjectCategory,
  ProjectImportResult,
  ProjectUploadData,
  PROJECT_NODE_VIEW,
  WbsNode,
} from '@wbs/core/models';
import { IdService } from '@wbs/core/services';

export class WbsNodePhaseProjectImporter {
  run(
    project: Project,
    existingNodes: WbsNode[],
    action: 'append' | 'overwrite',
    people: Map<string, string>,
    phases: Map<string, string | undefined>,
    nodes: Map<string, ProjectImportResult>
  ): ProjectUploadData {
    const results: ProjectUploadData = {
      disciplines: this.getDisciplines(project, people),
      phases: [],
      removeIds: [],
      upserts: [],
    };
    //
    //  If overwrite, mark all nodes to be deleted
    //
    if (action === 'overwrite') {
      for (const node of existingNodes) {
        results.removeIds.push(node.id);
      }
    } else {
      results.phases = project.phases;
    }
    let counter = 1;
    const phaseDelta = action === 'overwrite' ? 0 : project.phases.length;

    while (nodes.has(counter.toString())) {
      const info = nodes.get(counter.toString())!;
      const phaseId = IdService.generate();
      //
      //  add the phase
      //
      results.phases.push({
        id: phaseId,
        label: info.title,
        sameAs: phases.get(info.title),
      });
      //
      //  add the node
      //
      const children = this.getChildren(
        phaseId,
        counter.toString(),
        people,
        nodes
      );
      const now = new Date();
      const node: WbsNode = {
        id: phaseId,
        order: counter + phaseDelta,
        title: info.title,
        createdOn: now,
        lastModified: now,
        disciplineIds: this.getDisciplineFromPeople(info, people),
      };

      results.upserts.push(node, ...children);
      counter++;
    }

    return results;
  }

  private getChildren(
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

  private getDisciplineFromPeople(
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

  private getDisciplines(
    project: Project,
    people: Map<string, ProjectCategory>
  ): ProjectCategory[] {
    const results: ProjectCategory[] = [...(project?.disciplines ?? [])];
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
