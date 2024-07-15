import { Injectable } from '@angular/core';
import { NavigationLink } from '@wbs/core/models';
import { Resources } from '@wbs/core/services';

@Injectable()
export class NavigationMenuService {
  constructor(private readonly resources: Resources) {}

  //
  //    This was created so the labels can be translated before hand
  //        so the aria labels are translated as well.
  //
  processLinks(
    menu: NavigationLink[],
    isRecordEditable: boolean,
    claims: string[]
  ): NavigationLink[] {
    const processed: NavigationLink[] = [];

    for (const item of structuredClone(menu)) {
      const processedItem = this.processLink(item, isRecordEditable, claims);
      if (processedItem) processed.push(processedItem);
    }

    return processed;
  }

  private processLink(
    item: NavigationLink,
    isRecordEditable: boolean,
    claims: string[]
  ): NavigationLink | undefined {
    if (item.claim && !claims.includes(item.claim)) return undefined;
    if (item.onlyIfEditable && !isRecordEditable) return undefined;

    item.text = this.resources.get(item.text!);

    if (item.items) {
      const children: NavigationLink[] = [];

      for (const child of item.items) {
        const processed = this.processLink(child, isRecordEditable, claims);
        if (processed) children.push(processed);
      }
      item.items = children;
    }
    return item;
  }
}
