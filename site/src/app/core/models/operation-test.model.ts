export type OPERATOR = '=' | '!=' | '>' | '>=' | '<' | '<=';

export interface OperationTest {
  prop: string;
  op: OPERATOR;
  value: any;
}
