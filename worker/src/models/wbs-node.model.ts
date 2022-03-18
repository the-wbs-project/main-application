export interface WbsNode {
  id: string;
  title: string;
  parentWbsId?: string | null;
  parentNodeId?: string | null;
  levels: { p: number[]; d: number[] };
}
