export interface IdObject {
  id: string;
}
export interface DbObject extends IdObject {
  pk: string;
}
