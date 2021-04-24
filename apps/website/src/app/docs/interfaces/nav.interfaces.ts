import { DynTree } from '@myndpm/dyn-forms/core';

/**
 * Layout Navigation
 */
export interface NavItem {
  text: string;
  link: string;
}

export type NavigationData = DynTree<NavItem>;
