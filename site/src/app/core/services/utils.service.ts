export class Utils {
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
}
