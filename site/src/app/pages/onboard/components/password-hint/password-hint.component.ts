import { Component, computed, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'wbs-password-hint',
  templateUrl: './password-hint.component.html',
  imports: [FontAwesomeModule],
})
export class PasswordHintComponent {
  private readonly lowcaseTest: RegExp = /[a-z]/;
  private readonly uppercaseTest: RegExp = /[A-Z]/;
  private readonly digitTest: RegExp = /\d/;
  private readonly specialCharTest: RegExp =
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  readonly checkIcon = faCheck;
  readonly password = input.required<string>();

  readonly isEightOrMoreCharacters = computed(() => {
    return this.password().length >= 8;
  });
  readonly hasLowercase = computed(() => {
    return this.lowcaseTest.test(this.password());
  });
  readonly hasUppercase = computed(() => {
    return this.uppercaseTest.test(this.password());
  });
  readonly hasDigit = computed(() => {
    return this.digitTest.test(this.password());
  });
  readonly hasSpecialChar = computed(() => {
    return this.specialCharTest.test(this.password());
  });
}
