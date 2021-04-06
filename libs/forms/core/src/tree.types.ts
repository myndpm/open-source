// generic type for hierarchical trees
export type DynTree<T> = T & {
  children?: T[];
}
