
export enum DynLogLevel {
  All = 2**7 - 1,
  Hooks = 64,
  Ready = 32,
  Lifecycle = 16,
  Hierarchy = 8,
  Warning = 4,
  Error = 2,
  Fatal = 1,
  None = 0,
}

export const dynLogLevels = new Map<number, string>([
  [DynLogLevel.Hooks, 'HOOKS'],
  [DynLogLevel.Ready, 'READY'],
  [DynLogLevel.Lifecycle, 'CYCLE'],
  [DynLogLevel.Hierarchy, 'SETUP'],
  [DynLogLevel.Warning, 'WARN'],
  [DynLogLevel.Error, 'ERROR'],
  [DynLogLevel.Fatal, 'FATAL'],
]);
