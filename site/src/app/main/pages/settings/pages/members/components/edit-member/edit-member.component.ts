import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Member } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-edit-member',
  templateUrl: './edit-member.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,

  imports: [JsonPipe, TranslateModule],
})
export class EditMemberComponent implements OnInit {
  @Input() member?: Member;

  constructor(readonly modal: NgbActiveModal) {}

  ngOnInit(): void {}
}
