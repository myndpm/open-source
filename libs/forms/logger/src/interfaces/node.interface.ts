export interface DynNode {
  parent?: DynNode;
  deep: number;
  path: string[];
  dynControl?: string;
  instance: string;
}
