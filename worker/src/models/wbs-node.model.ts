export interface WbsNode {
  id: string;
  title: string;
  parentWbsId?: string | null;
  parentNodeId?: string | null;
  levels: { [phase: string]: number[] };
}
