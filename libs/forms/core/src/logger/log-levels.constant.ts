export enum DynLogLevel {
  Fatal = 7,
  Error = 6,
  Warning = 5,
  Info = 4,
  Debug = 3,
  Trace = 2,
  Verbose = 1,
}

// TODO reduce this to a colored letter?
export const dynLogLevels = new Map<number, string>([
  [7, 'FATAL'],
  [6, 'ERROR'],
  [5, 'WARN'],
  [4, 'INFO'],
  [3, 'DEBUG'],
  [2, 'TRACE'],
  [1, 'VERBOSE'],
]);
