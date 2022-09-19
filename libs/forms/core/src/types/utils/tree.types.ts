// generic type for hierarchical trees
export type DynTree<T> = T & {
  name?: string;
  detached?: boolean;
  children?: DynTree<T>[];
}
