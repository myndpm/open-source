export type DynTree<T> = T & {
  children?: T[];
}
