import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import {
  faEye,
  faEyeSlash,
  faLock as lock2,
} from '@fortawesome/pro-duotone-svg-icons';
import {
  faEnvelope,
  faEyes,
  faInfo,
  faLock,
  faPencil,
  faUser,
  faUserTie,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { StepperModule } from '@progress/kendo-angular-layout';
import { PopupModule } from '@progress/kendo-angular-popup';
import { LoadingComponent } from '@wbs/components/_utils/loading.component';
import { FooterComponent } from '@wbs/components/footer.component';
import { ProfileEditorComponent } from '@wbs/components/profile-editor';
import { DataServiceFactory } from '@wbs/core/data-services';
import { NavigationService, SaveService } from '@wbs/core/services';
import { environment } from 'src/env';
import { PasswordHintComponent } from './components/password-hint/password-hint.component';
import { Registration } from '@wbs/core/models';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';

@Component({
  standalone: true,
  templateUrl: './onboard.component.html',
  imports: [
    ButtonModule,
    FontAwesomeModule,
    FooterComponent,
    FormsModule,
    LoadingComponent,
    PasswordHintComponent,
    PopupModule,
    ProfileEditorComponent,
    ReactiveFormsModule,
    SaveButtonComponent,
    StepperModule,
    TextBoxModule,
    TranslateModule,
  ],
})
export class OnboardComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);
  private readonly navigate = inject(NavigationService);
  private readonly router = inject(Router);
  private readonly strongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  //
  //  Icons
  //
  readonly eyeIcon = faEye;
  readonly eyesIcon = faEyes;
  readonly lockIcon = lock2;
  readonly eyeSlashIcon = faEyeSlash;

  readonly infoIcon = faInfo;
  readonly nameIcon = faUser;
  readonly editIcon = faPencil;
  readonly titleIcon = faUserTie;
  readonly passwordIcon = faLock;
  readonly emailIcon = faEnvelope;
  readonly twitterIcon = faXTwitter;
  readonly linkedInIcon = faLinkedin;
  readonly title = environment.appTitle;
  //
  //  Inputs
  //
  readonly organizationId = input.required<string>();
  readonly inviteId = input.required<string>();
  //
  //  States
  //
  readonly loaded = signal(false);
  readonly isCancelled = signal(false);
  readonly saveState = new SaveService();
  readonly showExternally = signal<string[]>([]);
  //
  //  Form
  //
  readonly registerForm = new FormGroup({
    organization: new FormControl<string>(''),
    email: new FormControl<string>(''),
    fullName: new FormControl<string>('', {
      validators: [Validators.required],
    }),
    password: new FormControl<string>('', {
      validators: [
        Validators.required,
        Validators.pattern(this.strongPasswordRegx),
      ],
    }),
    title: new FormControl<string>(''),
    twitter: new FormControl<string>(''),
    linkedIn: new FormControl<string>(''),
  });

  ngOnInit(): void {
    this.data.onboard
      .getRecordAsync(this.organizationId(), this.inviteId())
      .subscribe((record) => {
        this.loaded.set(true);

        if (record.inviteStatus === 'Completed') {
          this.router.navigate(['']);
        } else if (record.userId) {
          //
          //  Redirect to a page behind the login where the user agrees to join the organization.
          //
          this.navigate.redirectToJoin(this.organizationId(), this.inviteId());
        } else if (record.inviteStatus !== 'Cancelled') {
          this.registerForm.patchValue({
            organization: record.organizationName,
            email: record.email,
          });
        } else {
          this.isCancelled.set(true);
        }
        this.loaded.set(true);
      });
  }

  toggleVisibility(item: string) {
    this.showExternally.update((list) => {
      if (list.includes(item)) {
        return list.filter((v) => v !== item);
      }
      return [...list, item];
    });
  }

  registerUser(): void {
    //
    //  Validate the form
    //
    if (!this.registerForm.valid) return;
    //
    //  Register the user
    //
    const formValues = this.registerForm.value;
    const record: Registration = {
      inviteId: this.inviteId(),
      email: formValues.email!,
      password: formValues.password!,
      fullName: formValues.fullName!,
      title: formValues.title ?? undefined,
      twitter: formValues.twitter ?? undefined,
      linkedIn: formValues.linkedIn ?? undefined,
      showExternally: this.showExternally(),
    };
  }
}
