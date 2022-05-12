import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { faCircleQuestion } from '@fortawesome/pro-duotone-svg-icons';
import { Project, PROJECT_NODE_VIEW } from '@wbs/shared/models';
import { WbsNodeView, WbsPhaseNodeView } from '@wbs/shared/view-models';
import { Subscription } from 'rxjs';
import { NodeCheck, Position } from '../../models';
import { WbsPhaseService } from '../../services';
import { BaseWbsTreeComponent } from '../base-wbs-tree.component';

@Component({
  selector: 'wbs-phase-tree',
  templateUrl: './wbs-phase-tree.component.html',
  styleUrls: ['../base-wbs-tree.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WbsPhaseTreeComponent
  extends BaseWbsTreeComponent<WbsPhaseNodeView>
  implements AfterViewInit, OnChanges, OnDestroy
{
  protected currentSubscription: Subscription | undefined;

  @Input() nodes: WbsPhaseNodeView[] | null | undefined;
  @Input() project: Project | null | undefined;
  @Input() toolbar: TemplateRef<any> | undefined;
  @Output() readonly selectedChanged = new EventEmitter<WbsNodeView>();

  readonly faCircleQuestion = faCircleQuestion;
  view = PROJECT_NODE_VIEW.DISCIPLINE;

  constructor(renderer: Renderer2, wbsService: WbsPhaseService, zone: NgZone) {
    super(renderer, wbsService, zone);
  }

  ngOnChanges(): void {
    if (!this.nodes) return;

    this.tree$.next(this.nodes);
    this.dataReady = true;
    this.setDraggableRows();
  }

  ngOnDestroy(): void {
    this.currentSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.setDraggableRows();
  }

  prePositionCheck(): NodeCheck {
    const results: NodeCheck = {
      cancelEffect: false,
      isParentDragged: false,
      newParentsAllowed: true,
    };
    let row: WbsNodeView | undefined = this.targetedItem;
    const list = <WbsPhaseNodeView[]>this.tree$.getValue()!;
    //
    //  If the we are trying to drag a node that is locked to a parent, make sure that's not happening
    //
    if (this.draggedItem.isLockedToParent) {
      results.newParentsAllowed = false;
      console.log('no new parents');
      if (
        this.draggedItem.isDisciplineNode &&
        this.draggedItem.parentId !== this.targetedItem.parentId
      ) {
        console.log('cant drag disicpline nodes to new parents');
        results.cancelEffect = true;

        return results;
      }
    }
    while (row!.parentId != null) {
      const parentRow = list.find((item) => item.id === row!.parentId);

      if (parentRow!.id === this.draggedItem.id) {
        results.isParentDragged = true;
        results.cancelEffect = true;
        break;
      }
      row = parentRow;
    }

    return results;
  }

  postPositionCheck(position: Position): boolean {
    //
    //  If you're trying to drop this INTO a discipline sync node, STOP IT!
    //
    if (
      this.targetedItem.syncWithDisciplines &&
      !position.isAfter &&
      !position.isBefore
    ) {
      return false;
    }
    //
    //  If you're trying to drop this before or after a a sync'ed child, STOP IT
    //
    if (
      !this.draggedItem.isLockedToParent &&
      this.targetedItem.isLockedToParent &&
      (position.isAfter || position.isBefore)
    ) {
      console.log('youre trying to drop this before or after a a synced child');
      return false;
    }

    return true;
  }
}
