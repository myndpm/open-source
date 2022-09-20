import chalk from 'chalk';
import { ExecOptions, SpawnOptions, SpawnSyncReturns } from 'child_process';
import { sync as spawnSync } from 'cross-spawn';
import { Observable, of } from 'rxjs';
import {
  ExecOutput,
  exec as baseExec,
  spawn as baseSpawn,
  spawnEnd,
  trim,
} from 'rxjs-shell';

// everything

export * from 'rxjs-shell';

/**
 * RxJs operators to execute and spawn tasks
 */

export interface IChildProcessOptions {
  log?: boolean;
  dryRun?: boolean;
}
export type IExecOptions = ExecOptions & IChildProcessOptions;
export type ISpawnOptions = Partial<SpawnOptions> & IChildProcessOptions;
export type IExecOutput = ExecOutput;

export function exec(
  cmd: string,
  args: string[],
  options?: IExecOptions
): Observable<IExecOutput>;
export function exec(
  cmd: string,
  args: Record<string, any>,
  options?: IExecOptions
): Observable<IExecOutput>;
export function exec(
  cmd: string,
  args: any,
  options: IExecOptions = {}
): Observable<IExecOutput> {
  const opts = {
    cwd: process.cwd(),
    env: process.env,
    log: false,
    ...options,
  };

  if (opts.log || opts.dryRun) {
    // log the executed command
    console.log(chalk.dim('>', cmd, args2str(args).join(' '))); // tslint:disable-line: no-console

    // returns if dry-run
    if (opts.dryRun) {
      return of({} as IExecOutput);
    }
  }

  return baseExec(`${cmd} ${args2str(args).join(' ')}`, opts).pipe(
    trim<IExecOutput>()
  );
}

export function spawn(
  cmd: string,
  args: string[],
  options?: ISpawnOptions
): Observable<IExecOutput>;
export function spawn(
  cmd: string,
  args: Record<string, any>,
  options?: ISpawnOptions
): Observable<IExecOutput>;
export function spawn(
  cmd: string,
  args: any,
  options: ISpawnOptions = {}
): Observable<IExecOutput> {
  const opts: ISpawnOptions = {
    cwd: process.cwd(),
    env: process.env,
    log: false,
    shell: true,
    stdio: 'inherit',
    ...options,
  };

  if (opts.log || opts.dryRun) {
    // log the executed command
    console.log(chalk.dim('>', cmd, args2str(args).join(' '))); // tslint:disable-line: no-console

    // returns if dry-run
    if (opts.dryRun) {
      return of({} as IExecOutput);
    }
  }

  return spawnEnd(baseSpawn(cmd, args2str(args), opts)).pipe(
    trim<IExecOutput>()
  );
}

// sync

export interface ISpawnSafeOptions extends SpawnOptions {
  throwOnError?: boolean;
  logStdErrOnError?: boolean;
}

const defaultOptions: ISpawnSafeOptions = {
  logStdErrOnError: true,
  throwOnError: true,
};

export function spawnSafeSync(
  command: string,
  args?: string[],
  options?: ISpawnSafeOptions
): SpawnSyncReturns<Buffer>;
export function spawnSafeSync(
  command: string,
  args?: Record<string, any>,
  options?: ISpawnSafeOptions
): SpawnSyncReturns<Buffer>;
export function spawnSafeSync(
  command: string,
  args?: any,
  options?: ISpawnSafeOptions
): SpawnSyncReturns<Buffer> {
  const mergedOptions = Object.assign({}, defaultOptions, options);
  const result = spawnSync(command, args2str(args), options);

  if (result.error || result.status !== 0) {
    if (mergedOptions.logStdErrOnError) {
      if (result.stderr) {
        console.error(result.stderr.toString());
      } else if (result.error) {
        console.error(result.error);
      }
    }
    if (mergedOptions.throwOnError) {
      throw result;
    }
  }

  return result;
}

// utilities

function args2str(args: string[] | Record<string, any>): string[] {
  return Array.isArray(args)
    ? args
    : Object.keys(args)
        // filter truthy values only
        .filter((key) => !!args[key])
        .map((key) => `--${toKebabCase(key)} ${args[key]}`);

  function toKebabCase(str: string) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }
}
