import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/pro-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  PDFViewerModule,
  PDFViewerTool,
} from '@progress/kendo-angular-pdfviewer';
import { RecordResource } from '@wbs/core/models';
import { YouTubeSizerDirective } from '../../directives/youtube-sizer.directive';

@Component({
  standalone: true,
  selector: 'wbs-resource-view-link',
  templateUrl: './resource-view-link.component.html',
  imports: [
    FontAwesomeModule,
    NgFor,
    NgIf,
    PDFViewerModule,
    TranslateModule,
    YouTubeSizerDirective,
  ],
})
export class ResourceViewLinkComponent {
  @Input({ required: true }) resource!: RecordResource;

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
    this.modalService
      .open(content, {
        fullscreen: true,
        ariaLabelledBy: 'modal-basic-title',
        modalDialogClass: 'modal-almost-fullscreen',
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }
}