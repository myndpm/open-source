// generic type for hierarchical trees
export type DynTree<T> = T & {
  name?: string;
  children?: DynTree<T>[];
}
