import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  ExtractPhaseNodeView,
  ListItem,
  WbsNode,
  WbsPhaseNode,
} from '@wbs/shared/models';
import { IdService } from '@wbs/shared/services';
import { MetadataState } from '@wbs/shared/states';
import { ExtractResults } from '../models';
import { TextCompareService } from './text-compare.service';

@Injectable()
export class PhaseExtractProcessor {
  private readonly tolerance = 0.75;

  constructor(
    private readonly store: Store,
    private readonly textComparer: TextCompareService
  ) {}

  run(
    projectPhases: (string | ListItem)[],
    originals: WbsNode[],
    viewModels: WbsPhaseNode[],
    fromExtract: ExtractPhaseNodeView[]
  ): ExtractResults {
    const fromExtractMap = new Map<string, ExtractPhaseNodeView>();
    const upsertVms: ExtractPhaseNodeView[] = [];
    const phases: (string | ListItem)[] = [];
    const phaseIds: string[] = [];
    const cats = this.store.selectSnapshot(MetadataState.phaseCategories);
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
    const removeIds = originals.filter((x) => x.phase != null).map((x) => x.id);

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

    for (var node of fromExtract) {
      if (phaseIds.indexOf(node.id) > -1) continue;

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
        if (match.disciplines != node.disciplines) {
          match.disciplines = node.disciplines;
          changed = true;
        }
        if (match.syncWithDisciplines != node.syncWithDisciplines) {
          match.syncWithDisciplines = node.syncWithDisciplines;
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
    var upserts: WbsNode[] = [];
    const syncIds = upsertVms
      .filter((x) => x.syncWithDisciplines)
      .map((x) => x.id);

    for (const vm of upsertVms) {
      //
      let model = originals.find((x) => x.id === vm.id);

      if (model) {
        model.title = vm.title;
        model.description = vm.description;
        model.disciplineIds = vm.disciplines;
        model.phase = {
          order: vm.order,
          parentId: vm.parentId!,
          isDisciplineNode: false,
          syncWithDisciplines: vm.syncWithDisciplines,
        };
      } else {
        model = {
          id: vm.id,
          title: vm.title,
          description: vm.description,
          disciplineIds: vm.disciplines,
          phase: {
            order: vm.order,
            parentId: vm.parentId!,
            isDisciplineNode: false,
            syncWithDisciplines: vm.syncWithDisciplines,
          },
        };
      }
      const parentId = model.phase!.parentId;
      //
      //  Now let's check if parent is a sync and if disciplines match
      //
      if (syncIds.indexOf(parentId) > -1) {
        const parent = upsertVms.find((x) => x.id === parentId)!;

        model.phase!.isDisciplineNode =
          (parent.disciplines?.indexOf(model.disciplineIds![0]) ?? -1) > -1;
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
    fromExtractMap: Map<string, ExtractPhaseNodeView>,
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

  private compare(s1: string, s2: string): boolean {
    return this.textComparer.similarity(s1, s2) >= this.tolerance;
  }
}
