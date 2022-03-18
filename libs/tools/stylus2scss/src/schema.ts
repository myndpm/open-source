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
  comments: boolean;
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
  comments = true;
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

  shouldAnalize(file: string): boolean {
    return this.isStylus(file) && !this.onlyDiagnose && !this.onlyMigrate;
  }

  shouldConvert(file: string): boolean {
    return this.isStylus(file) && !this.onlyDiagnose && !this.onlyMigrate;
  }

  shouldMigrate(file: string): boolean {
    return !this.onlyDiagnose && (this.dryRun || file.endsWith('.scss'));
  }

  shouldCommit(): boolean {
    return this.git && !this.onlyDiagnose && this.commit;
  }
}
