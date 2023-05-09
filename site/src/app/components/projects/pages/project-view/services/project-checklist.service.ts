import { Injectable } from '@angular/core';
import { Project, ROLES, WbsNode } from '@wbs/core/models';
import { CHECKLIST_RESULTS_CONST, ChecklistItemResults } from '../models';

@Injectable()
export class ProjectChecklistService {
  private readonly FAIL = CHECKLIST_RESULTS_CONST.FAIL;
  private readonly PASS = CHECKLIST_RESULTS_CONST.PASS;
  private readonly WARN = CHECKLIST_RESULTS_CONST.WARN;

  calculate(project: Project, nodes: WbsNode[]): ChecklistItemResults[] {
    return [
      this.allRolesSet(project),
      this.description(project),
      this.phases(project),
      this.phaseTasks(project, nodes),
    ];
  }

  private description(project: Project): ChecklistItemResults {
    const pass = (project.description ?? '').trim().length > 0;

    return {
      description: 'ProjectChecklist.Description',
      result: pass ? this.PASS : this.FAIL,
      message: pass ? undefined : 'ProjectChecklist.DescriptionFail',
    };
  }

  private phases(project: Project): ChecklistItemResults {
    const result =
      project.categories.phase.length === 0
        ? this.FAIL
        : project.categories.phase.length <= 2
        ? this.WARN
        : this.PASS;

    return {
      description: 'ProjectChecklist.Phases',
      result,
      message:
        result === this.FAIL
          ? 'ProjectChecklist.PhasesFail'
          : result === this.WARN
          ? 'ProjectChecklist.PhasesWarn'
          : undefined,
    };
  }

  private phaseTasks(project: Project, tasks: WbsNode[]): ChecklistItemResults {
    let result = this.PASS;

    for (const phase of project.categories.phase) {
      const phaseId = typeof phase === 'string' ? phase : phase.id;

      if (!tasks.some((t) => !t.removed && t.parentId === phaseId)) {
        result = this.FAIL;
        break;
      }
    }

    return {
      result,
      description: 'ProjectChecklist.PhaseTasks',
      message:
        result === this.FAIL ? 'ProjectChecklist.PhaseTasksFail' : undefined,
    };
  }

  private allRolesSet(project: Project): ChecklistItemResults {
    const pass =
      project.roles.some((r) => r.role === ROLES.APPROVER) &&
      project.roles.some((r) => r.role === ROLES.PM) &&
      project.roles.some((r) => r.role === ROLES.SME);

    return {
      result: pass ? this.PASS : this.FAIL,
      description: 'ProjectChecklist.Roles',
      message: pass ? undefined : 'ProjectChecklist.RolesFail',
    };
  }
}
