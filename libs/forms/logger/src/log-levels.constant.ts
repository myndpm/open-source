
export enum DynLogLevel {
  All = 2**8 - 1,
  Hooks = 128,
  Ready = 64,
  Lifecycle = 32,
  Hierarchy = 16,
  Debug = 8,
  Warning = 4,
  Error = 2,
  Fatal = 1,
}

export const dynLogLevels = new Map<number, string>([
  [DynLogLevel.Hooks, 'HOOKS'],
  [DynLogLevel.Ready, 'READY'],
  [DynLogLevel.Lifecycle, 'CYCLE'],
  [DynLogLevel.Hierarchy, 'SETUP'],
  [DynLogLevel.Debug, 'DEBUG'],
  [DynLogLevel.Warning, 'WARN'],
  [DynLogLevel.Error, 'ERROR'],
  [DynLogLevel.Fatal, 'FATAL'],
]);
