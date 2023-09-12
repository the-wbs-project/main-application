import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface Role {
  id: string;
  name: string;
  description: string;
  abbreviation: string;
  icon: IconDefinition
}
