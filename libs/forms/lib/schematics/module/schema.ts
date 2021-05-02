
export class Schema {
  /**
   * Angular options.
   */
  path?: string;
  project?: string;
  prefix?: string;
  /**
   * The name of the DynModule.
   */
  name!: string;
  /**
   * Default control options.
   */
  controlPath?: string;
  controlName!: string;
  type?: string;
  id!: string;
  instance?: string;
  /**
   * Flag to indicate if a directory is created.
   */
  flat?: boolean;
  /**
   * The declaring NgModule.
   */
  module?: string;
  /**
   * Apply lint fixes after generating the module.
   */
  lintFix?: boolean;
}
