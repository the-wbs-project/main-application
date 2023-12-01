import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/pro-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  PDFViewerModule,
  PDFViewerTool,
} from '@progress/kendo-angular-pdfviewer';
import { ResourceRecord } from '@wbs/core/models';
import { YouTubeSizerDirective } from '../../directives/youtube-sizer.directive';
import { ResourceObjectPipe } from '../../pipes/resource-object.pipe';

@Component({
  standalone: true,
  selector: 'wbs-resource-view-link',
  templateUrl: './resource-view-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    FontAwesomeModule,
    NgIf,
    PDFViewerModule,
    ResourceObjectPipe,
    TranslateModule,
    YouTubeSizerDirective,
  ],
})
export class ResourceViewLinkComponent {
  @Input({ required: true }) owner!: string;
  @Input({ required: true }) record!: ResourceRecord;

  readonly faEye = faEye;
  readonly tools: PDFViewerTool[] = [
    'pager',
    'spacer',
    'zoomInOut',
    'zoom',
    'selection',
    'spacer',
    'search',
    'download',
    'print',
  ];

  constructor(private modalService: NgbModal) {}

  open(content: any) {
    this.modalService.open(content, {
      fullscreen: true,
      ariaLabelledBy: 'modal-basic-title',
      modalDialogClass: 'modal-almost-fullscreen',
    });
  }
}
