import { resolve } from 'path';

export interface Options {
  path: string;
  diagnose: boolean; // dry run
  onlyMigrate: boolean; // only sass-migrate
  file?: string;
}

export function parseOptions(options: { [key: string]: any }): Options {
  return {
    ...options as Options,
    path: resolve(options.path),
  };
}
