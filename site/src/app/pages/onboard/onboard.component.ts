import { Component } from '@angular/core';
import { ProfileEditorComponent } from '@wbs/components/profile-editor';

@Component({
  standalone: true,
  templateUrl: './onboard.component.html',
  imports: [ProfileEditorComponent],
})
export class OnboardComponent {}
