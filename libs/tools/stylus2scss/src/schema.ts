import { resolve } from 'path';

export interface Options {
  path: string;
  diagnose: boolean; // dry run
  onlyMigrate: boolean; // only sass-migrate
  // converter
  quote: 'single' | 'double';
  autoprefixer: boolean;
  indent: string;
  signComments: boolean;
  // execution
  file?: string;
}

export function parseOptions(options: { [key: string]: any }): Options {
  return {
    ...options as Options,
    path: resolve(options.path),
  };
}
