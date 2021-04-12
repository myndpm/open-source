import { DynLogLevel } from './log-levels.constant';

export interface DynLog {
  /**
   * Level of severity.
   */
  readonly level: DynLogLevel;
  /**
   * Log message describing an event.
   */
  readonly message: string;
  /**
   * Optional payload related to the event.
   */
  readonly payload?: any;
}
