import { ChangeDetection, ViewEncapsulation } from '@angular/cli/lib/config/schema';

export class Schema {
  /**
   * Angular options.
   */
  path?: string;
  project?: string;
  type?: string;
  /**
   * The name of the control.
   */
  name!: string;
  /**
   * The ID of the control.
   */
  id!: string;
  /**
   * The control instance type of the new control.
   */
  instance!: string;
  /**
   * The prefix to apply to generated selectors.
   */
  prefix?: string;
  /**
   * Whether to prefix the control class name.
   */
  prefixClass?: boolean;
  /**
   * The selector to use for the component.
   */
  selector?: string;
  /**
   * The file extension or preprocessor to use for style files.
   */
  style?: any;
  /**
   * Specifies if the style will contain `:host { display: block; }`.
   */
  displayBlock?: boolean;
  /**
   * Specifies the view encapsulation strategy.
   */
  viewEncapsulation?: ViewEncapsulation;
  /**
   * Specifies the change detection strategy.
   */
  changeDetection?: ChangeDetection;
  /**
   * Do not create the unit test.
   */
  skipTests?: boolean;
  /**
   * Flag to indicate if a directory is created.
   */
  flat?: boolean;
  /**
   * Allows specification of the declaring module.
   */
  module?: string;
  /**
   * Specifies if declaring module exports the component.
   */
  export?: boolean;
  /**
   * Apply lint fixes after generating the module.
   */
  lintFix?: boolean;
}
