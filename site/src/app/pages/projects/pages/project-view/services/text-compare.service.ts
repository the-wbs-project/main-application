import { Injectable } from '@angular/core';

@Injectable()
export class TextCompareService {
  similarity(s1: string, s2: string, isCaseSensitive = true): number {
    const test1 = isCaseSensitive ? s1 : s1.toLowerCase();
    const test2 = isCaseSensitive ? s2 : s2.toLowerCase();

    if (test1 === test2) return 1;

    let longer = test1;
    let shorter = test2;
    if (test1.length < test2.length) {
      longer = test2;
      shorter = test1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) {
      return 1.0;
    }
    return (
      (longerLength - this.editDistance(longer, shorter)) /
      parseFloat(longerLength.toString())
    );
  }

  private editDistance(s1: string, s2: string): number {
    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }
}
