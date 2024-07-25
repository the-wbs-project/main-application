import { ActivatedRouteSnapshot } from '@angular/router';
import { FileInfo } from '@progress/kendo-angular-upload';
import { Observable } from 'rxjs';
import { OPERATOR, OperationTest } from '../models';

export class Utils {
  static getParam(route: ActivatedRouteSnapshot, prop: string): string {
    let r: ActivatedRouteSnapshot | null = route;

    while (r) {
      if (r.params[prop]) return r.params[prop];
      r = r.parent;
    }
    return '';
  }

  static getFileAsync(file: FileInfo): Observable<ArrayBuffer> {
    return new Observable<ArrayBuffer>((obs) => {
      if (!file) {
        obs.complete();
        return;
      }
      const reader = new FileReader();

      reader.onload = function (ev) {
        const data = ev.target?.result;

        obs.next(<ArrayBuffer>data);
        obs.complete();
      };

      reader.readAsArrayBuffer(file.rawFile!);
    });
  }

  static areArraysEqual<T>(
    a: T[] | null | undefined,
    b: T[] | null | undefined
  ): boolean {
    if (a == null && b == null) return true;
    if (a != null && b == null) return false;
    if (a == null && b != null) return false;
    if (a!.length !== b!.length) return false;

    const b2 = [...b!];
    for (const x of a!) {
      const i = b2.indexOf(x);

      if (i === -1) return false;

      b2.splice(i, 1);
    }

    return b2.length === 0;
  }

  static cleanDates<T, K extends keyof T>(
    obj: T | T[],
    ...properties: K[]
  ): void {
    if (Array.isArray(obj)) {
      for (const item of obj) this.cleanDates(item, ...properties);
      return;
    }

    for (const property of properties) {
      const value = <string | undefined>obj[property];

      //@ts-ignore
      if (value) obj[property] = new Date(value);
    }
  }

  static contains(
    list: string[] | undefined,
    toCheck: string | string[] | undefined
  ): boolean {
    if (!toCheck) return true;
    if (!list) return false;

    if (!Array.isArray(toCheck)) toCheck = [toCheck];

    return toCheck.some((claim) => list.includes(claim));
  }

  static executeTestByObject(
    data: Record<string, any> | Record<string, any>[] | undefined,
    test: OperationTest
  ): boolean {
    if (!data) return false;
    if (Array.isArray(data)) {
      for (const item of data) {
        if (!this.executeTestByObject(item, test)) return false;
      }
      return true;
    }
    return this.executeTestByValue(data[test.prop], test.op, test.value);
  }

  static executeTestByValue<T>(val1: T, op: OPERATOR, val2: T): boolean {
    switch (op) {
      case '=':
        return val1 == val2;
      case '!=':
        return val1 != val2;
      case '>':
        return val1 > val2;
      case '>=':
        return val1 >= val2;
      case '<':
        return val1 < val2;
      case '<=':
        return val1 <= val2;
    }
  }
}
