export interface DynNode {
  parent?: DynNode;
  index?: number;
  deep: number;
  path: string[];
  route: string[];
  dynControl?: string;
  instance: string;
}
