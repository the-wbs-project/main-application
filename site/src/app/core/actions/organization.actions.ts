export class LoadOrganization {
  static readonly type = '[Organization] Load';
  constructor(readonly organization: string) {}
}
