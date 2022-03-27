import { existsSync } from 'fs';
import { resolve } from 'path';

export interface Options {
  path: string;
  commit: boolean;
  git: boolean;
  dryRun: boolean;
  // steps
  diagnose: boolean;
  convert: boolean;
  migrate: boolean;
  // converter
  quote: 'single' | 'double';
  indent: string;
  autoprefixer: boolean;
  // runtime
  file?: string;
}

export class Schema implements Options {
  path = '.';
  commit = true;
  git = true;
  dryRun = false;
  diagnose = false;
  convert = false;
  migrate = false;
  quote: 'single' | 'double' = 'single';
  indent = '0';
  autoprefixer = false;
  file?: string;

  get onlyDiagnose(): boolean {
    return !this.migrate && this.diagnose && !this.convert;
  }

  get onlyMigrate(): boolean {
    return this.migrate && !this.diagnose && !this.convert;
  }

  constructor(options: Options) {
    Object.assign(
      this,
      options,
      { path: resolve(options.path) },
    );
  }

  withFile(file: string): Required<Schema> {
    return new Schema({ ...this, file }) as Required<Schema>;
  }

  isValid(file: string): boolean {
    return !file.includes('node_modules') &&
      (file.endsWith('.styl') || this.migrate && file.endsWith('.scss'));
  }

  isStylus(file: string): boolean {
    return file.endsWith('.styl');
  }

  tsExists(file: string): boolean {
    return existsSync(file.replace(/\.styl$/, '.ts'));
  }

  shouldAnalize(file: string): boolean {
    return this.isStylus(file) && !this.onlyDiagnose && !this.onlyMigrate;
  }

  shouldConvert(file: string): boolean {
    return this.isStylus(file) && !this.onlyDiagnose && !this.onlyMigrate;
  }

  shouldCheckComponent(file: string): boolean {
    return this.tsExists(file) && !this.onlyDiagnose;
  }

  shouldRename(file: string): boolean {
    return file.endsWith('.styl') && (!this.onlyDiagnose || this.dryRun);
  }

  shouldMigrate(file: string): boolean {
    return file.endsWith('.scss') && (!this.onlyDiagnose || this.dryRun);
  }

  shouldCommit(): boolean {
    return this.git && !this.onlyDiagnose && this.commit;
  }
}
