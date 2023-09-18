export class LoadProjects {
  static readonly type = '[Project List] Load';
  constructor(readonly owner: string) {}
}
