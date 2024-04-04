import { Injectable, inject } from '@angular/core';
import { ListItem, WbsNode } from '@wbs/core/models';
import { IdService, Utils } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { MetadataState } from '@wbs/main/services';
import { ExtractResults } from '../../../models';
import { TextCompareService } from './text-compare.service';

@Injectable()
export class PhaseExtractProcessor {
  private readonly metadata = inject(MetadataState);
  private readonly textComparer = inject(TextCompareService);
  private readonly tolerance = 0.75;

  run(
    projectPhases: (string | ListItem)[],
    originals: WbsNode[],
    viewModels: WbsNodeView[],
    fromExtract: WbsNodeView[],
    inheritDisciplines: boolean
  ): ExtractResults {
    const fromExtractMap = new Map<string, WbsNodeView>();
    const upsertVms: (WbsNodeView | WbsNodeView)[] = [];
    const phases: (string | ListItem)[] = [];
    const phaseIds: string[] = [];
    const cats = this.metadata.categories.phases;
    const phaseList = <ListItem[]>projectPhases.map((x) => {
      if (typeof x === 'string') return cats.find((c) => c.id === x);

      return x;
    });
    //
    //  Let's populate map by level
    //
    for (const model of fromExtract) fromExtractMap.set(model.levelText, model);
    //
    //  Lets get all IDS for phase
    //
    const removeIds = originals.map((x) => x.id);

    for (var node of fromExtract) {
      let match = viewModels.find((x) => x.levelText === node.levelText);

      if (match && !this.compare(match.title, node.title)) match = undefined;

      if (match) {
        //
        //  Let's a match, let's first get say we are NOT going to remove it.
        //
        const rIndex = removeIds.indexOf(match.id);

        if (rIndex > -1) removeIds.splice(rIndex, 1);

        node.id = match.id;
        //
        //  Do more????
        //
      } else {
        node.id = IdService.generate();

        //
        //  Do more????
        //
      }
    }
    //
    //  Now let's tackle the categories and verifying the parent IDs are setup properly
    //
    var cat = 1;

    while (true) {
      var phaseNode = fromExtractMap.get(cat.toString());

      if (!phaseNode) break;

      const phaseCat = phaseList.find((x) => x.label === phaseNode?.title);
      let catId = '';

      if (phaseCat) {
        phases.push(phaseCat.id);
        catId = phaseCat.id;
      } else {
        catId = phaseNode.id;

        phases.push(<ListItem>{
          id: catId,
          label: phaseNode.title,
        });
      }
      phaseIds.push(catId);

      this.updateParentIds(fromExtractMap, catId, catId, phaseNode.levelText);
      cat++;
    }

    if (inheritDisciplines) this.inheritDisciplines(fromExtract);
    //
    //  Now let's look through the rows and find out what tasks has been changed
    //
    for (var node of fromExtract) {
      var match = viewModels.find((x) => x.id === node.id);

      if (match) {
        var changed = false;

        if (match.title != node.title) {
          match.title = node.title;
          changed = true;
        }
        if (match.description != node.description) {
          match.description = node.description;
          changed = true;
        }
        if (!Utils.areArraysEqual(match.disciplines, node.disciplines)) {
          match.disciplines = node.disciplines;
          changed = true;
        }
        if (match.parentId != node.parentId) {
          match.parentId = node.parentId;
          changed = true;
        }
        if (match.phaseId != node.phaseId) {
          match.parentId = node.parentId;
          changed = true;
        }
        if (changed) upsertVms.push(match);
      } else {
        upsertVms.push(node);
      }
    }
    //
    //  Convert the upserts
    //
    const upserts: WbsNode[] = [];
    const now = new Date();

    for (const vm of upsertVms) {
      let model = originals.find((x) => x.id === vm.id);

      if (model) {
        model.title = vm.title;
        model.description = vm.description;
        model.disciplineIds = vm.disciplines;
        model.parentId = vm.parentId;
        model.order = vm.order;
        model.lastModified = now;
      } else {
        model = {
          id: vm.id,
          title: vm.title,
          description: vm.description,
          disciplineIds: vm.disciplines,
          parentId: vm.parentId,
          order: vm.order,
          createdOn: now,
          lastModified: now,
        };
      }
      upserts.push(model);
    }

    return {
      cats: phases,
      removeIds,
      upserts,
    };
  }

  private updateParentIds(
    fromExtractMap: Map<string, WbsNodeView>,
    phaseId: string,
    parentId: string,
    parentLevel: string
  ): void {
    var order = 1;

    while (true) {
      var level = `${parentLevel}.${order}`;
      var node = fromExtractMap.get(level);

      if (node == undefined) return;

      node.parentId = parentId;
      node.order = order;
      node.phaseId = phaseId;

      this.updateParentIds(fromExtractMap, phaseId, node.id, level);
      order++;
    }
  }

  private inheritDisciplines(rows: WbsNodeView[]) {
    var byId = new Map<string, WbsNodeView>();
    var depths = new Map<number, WbsNodeView[]>();

    for (const row of rows) {
      byId.set(row.id, row);

      const depth = row.levelText.split('.').length;

      if (depths.has(depth)) depths.get(depth)!.push(row);
      else depths.set(depth, [row]);
    }
    var level = Math.max(...depths.keys());

    for (let i = level; i > 0; i--) {
      for (const row of depths.get(i)!) {
        if (row.parentId == null || row.disciplines == null) continue;

        const parent = byId.get(row.parentId)!;

        if (parent.disciplines == null) parent.disciplines = [];

        for (const id of row.disciplines) {
          if (parent.disciplines.indexOf(id) > -1) continue;

          parent.disciplines.push(id);
        }
      }
    }
  }

  private compare(s1: string, s2: string): boolean {
    return this.textComparer.similarity(s1, s2) >= this.tolerance;
  }
}
