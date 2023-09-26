import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { SVGIcon } from '@progress/kendo-svg-icons';

export const faToKendo = (icon: IconDefinition): SVGIcon =>
  <SVGIcon>{
    name: icon.iconName,
    content: `<path d="${icon.icon[4]}" />`,
    viewBox: `0 0 ${icon.icon[0]} ${icon.icon[1]}`,
  };
