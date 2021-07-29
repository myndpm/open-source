
export enum DynLogLevel {
  All = 2**9 - 1,
  Hooks = 2**8,
  Ready = 2**7,
  Load = 2**6,
  Lifecycle = 2**5,
  Hierarchy = 2**4,
  Debug = 2**3,
  Warning = 2**2,
  Error = 2**1,
  Fatal = 2**0,
}

export const dynLogLevels = new Map<number, string>([
  [DynLogLevel.Hooks, 'HOOKS'],
  [DynLogLevel.Ready, 'READY'],
  [DynLogLevel.Load, 'LOAD'],
  [DynLogLevel.Lifecycle, 'CYCLE'],
  [DynLogLevel.Hierarchy, 'SETUP'],
  [DynLogLevel.Debug, 'DEBUG'],
  [DynLogLevel.Warning, 'WARN'],
  [DynLogLevel.Error, 'ERROR'],
  [DynLogLevel.Fatal, 'FATAL'],
]);
