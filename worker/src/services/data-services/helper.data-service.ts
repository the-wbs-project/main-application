export class DataServiceHelper {
  static fixTs(objOrArray: { _ts: number } | { _ts: number }[]): void {
    if (Array.isArray(objOrArray)) {
      for (const obj of objOrArray) this.fixTs(obj);
    } else if (objOrArray) {
      objOrArray._ts = this.fixTsValue(objOrArray._ts);
    }
  }

  static fixTsValue(ts: number): number {
    return (ts *= 1000);
  }
}
