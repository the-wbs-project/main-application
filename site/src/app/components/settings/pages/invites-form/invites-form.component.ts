import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faEnvelope, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { ROLES } from '@wbs/core/models';
import { BehaviorSubject, map } from 'rxjs';
import { ChangeBreadcrumbs, SendInvite } from '../../actions';
import { Breadcrumb } from '../../models';
import { InviteValidators } from '../../services';
import { UserAdminState } from '../../states';

@Component({
  templateUrl: './invites-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [InviteValidators],
})
export class InvitesFormComponent implements OnInit {
  private readonly crumbs: Breadcrumb[] = [
    {
      text: 'Settings.Invites',
      url: '/settings/invites',
    },
  ];
  readonly faPlus = faPlus;
  readonly faEnvelope = faEnvelope;
  readonly isNewInvite$ = new BehaviorSubject<boolean>(false);
  readonly existingEmail$ = new BehaviorSubject<string | undefined>(undefined);
  readonly form = new FormGroup(
    {
      email: new FormControl<string | undefined>(undefined, [
        Validators.required,
        Validators.email,
        this.validators.alreadyUser(),
        this.validators.alreadyInvite(),
      ]),
      pm: new FormControl<boolean>(true),
      approver: new FormControl<boolean>(false),
      sme: new FormControl<boolean>(false),
      admin: new FormControl<boolean>(false),
    },
    [this.validators.atleastOneRole()]
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly validators: InviteValidators
  ) {}

  get controls() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        map((x) => {
          const id = x['id'];

          this.store.dispatch(
            new ChangeBreadcrumbs([
              ...this.crumbs,
              {
                text:
                  id === 'send' ? 'Settings.SendInvite' : 'Settings.EditInvite',
              },
            ])
          );
          this.isNewInvite$.next(id === 'send');
          if (id === 'send') return undefined;
          return this.store
            .selectSnapshot(UserAdminState.invites)
            .find((x) => x.id === id);
        }),
        takeUntilDestroyed()
      )
      .subscribe((invite) => {
        const roles = invite?.roles ?? [];

        this.existingEmail$.next(invite?.email);

        if (invite)
          this.form.setValue({
            email: invite?.email,
            admin: roles.indexOf(ROLES.ADMIN) > -1,
            approver: roles.indexOf(ROLES.APPROVER) > -1,
            pm: roles.indexOf(ROLES.PM) > -1,
            sme: roles.indexOf(ROLES.SME) > -1,
          });
        else this.form.reset();
      });
  }

  protected submit(): void {
    const values = this.form.getRawValue();
    const roles: string[] = [];

    if (values.pm) roles.push(ROLES.PM);
    if (values.approver) roles.push(ROLES.APPROVER);
    if (values.sme) roles.push(ROLES.SME);
    if (values.admin) roles.push(ROLES.ADMIN);

    this.store
      .dispatch(new SendInvite(values.email!, roles))
      .pipe(
        map(() => this.store.dispatch(new Navigate(['/settings', 'invites'])))
      );
  }
}
