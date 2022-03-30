import { existsSync } from 'fs';
import { resolve } from 'path';

export interface Options {
  path: string;
  git: boolean;
  dryRun: boolean;
  // steps
  diagnose: boolean;
  convert: boolean;
  move: boolean;
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
  git = true;
  dryRun = false;
  diagnose = false;
  convert = false;
  move = false;
  migrate = false;
  quote: 'single' | 'double' = 'single';
  indent = '0';
  autoprefixer = false;
  file?: string;

  get onlyDiagnose(): boolean {
    return this.diagnose && !this.convert && !this.move && !this.migrate;
  }

  get onlyConvert(): boolean {
    return !this.diagnose && this.convert && !this.move && !this.migrate;
  }

  get onlyMove(): boolean {
    return !this.diagnose && !this.convert && this.move && !this.migrate;
  }

  get onlyMigrate(): boolean {
    return !this.diagnose && !this.convert && !this.move && this.migrate;
  }

  constructor(opts: Options) {
    const allSteps = !opts.diagnose && !opts.convert && !opts.move && !opts.migrate;
    Object.assign(
      this,
      {
        ...opts,
        path: resolve(opts.path),
        diagnose: allSteps || opts.diagnose,
        convert: allSteps || opts.convert,
        move: allSteps || opts.move,
        migrate: allSteps || opts.migrate,
      },
    );
  }

  withFile(file: string): Required<Schema> {
    return new Schema({ ...this, file }) as Required<Schema>;
  }

  isValid(file: string): boolean {
    return !file.includes('node_modules') && (this.isStylus(file) || this.shouldMigrate(file));
  }

  isStylus(file: string): boolean {
    return file.endsWith('.styl');
  }

  tsExists(file: string): boolean {
    return existsSync(file.replace(/\.styl$/, '.ts'));
  }

  shouldAnalize(file: string): boolean {
    return (this.diagnose || this.convert) && this.isStylus(file);
  }

  shouldConvert(file: string): boolean {
    return this.convert && this.isStylus(file);
  }

  shouldConvertCommit(): boolean {
    return this.convert && this.shouldCommit();
  }

  shouldCheckComponent(file: string): boolean {
    return this.shouldMove(file) && this.tsExists(file);
  }

  shouldMove(file: string): boolean {
    return this.move && file.endsWith('.styl');
  }

  shouldCommitMove(): boolean {
    return this.move && this.shouldCommit();
  }

  shouldMigrate(file: string): boolean {
    return this.migrate && file.endsWith('.scss');
  }

  shouldCommitMigration(): boolean {
    return this.migrate && this.shouldCommit();
  }

  private shouldCommit(): boolean {
    return !this.onlyDiagnose && this.git;
  }
}
