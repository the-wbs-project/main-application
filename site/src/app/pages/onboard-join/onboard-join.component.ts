import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '@wbs/components/footer.component';
import { ProfileEditorComponent } from '@wbs/components/profile-editor';
import { DataServiceFactory } from '@wbs/core/data-services';
import { OnboardRecord } from '@wbs/core/models';
import { NavigationService } from '@wbs/core/services';
import { environment } from 'src/env';

@Component({
  standalone: true,
  templateUrl: './onboard-join.component.html',
  imports: [FooterComponent, ProfileEditorComponent],
})
export class OnboardJoinComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);

  readonly title = environment.appTitle;
  readonly organizationId = input.required<string>();
  readonly inviteId = input.required<string>();
  readonly record = signal<OnboardRecord | undefined>(undefined);
  readonly loaded = signal(false);

  ngOnInit(): void {
    this.data.onboard
      .getRecordAsync(this.organizationId(), this.inviteId())
      .subscribe((record) => {
        this.record.set(record);
        this.loaded.set(true);

        if (record.userId) {
          //
          //  Redirect to a page behind the login where the user agrees to join the organization.
          //
        }
      });
  }
}
