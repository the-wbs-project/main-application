import { Component, inject, input, OnInit } from '@angular/core';
import { ProfileEditorComponent } from '@wbs/components/profile-editor';
import { DataServiceFactory } from '@wbs/core/data-services';

@Component({
  standalone: true,
  templateUrl: './onboard.component.html',
  imports: [ProfileEditorComponent],
})
export class OnboardComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);

  readonly inviteId = input.required<string>();

  ngOnInit(): void {
    this.data.invites.getAsync(this.inviteId()).subscribe((invite) => {
      //
    });
  }
}
