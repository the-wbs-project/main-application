import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { SVGIcon, SVGIconModule } from '@progress/kendo-angular-icons';

@Component({
  standalone: true,
  selector: 'wbs-icon',
  template: `
    <kendo-svg-icon *ngIf="isKendo(icon)" [icon]="icon" />
    <fa-icon *ngIf="isFA(icon)" [icon]="icon" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgIf, SVGIconModule],
})
export class IconComponent {
  @Input({ required: true }) icon!: SVGIcon | IconDefinition;

  isKendo(icon: SVGIcon | IconDefinition): icon is SVGIcon {
    return (<SVGIcon>icon).viewBox !== undefined;
  }

  isFA(icon: SVGIcon | IconDefinition): icon is IconDefinition {
    return (<IconDefinition>icon).prefix !== undefined;
  }
}
