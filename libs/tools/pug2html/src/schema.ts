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
  prettify: boolean;
  // runtime
  file?: string;
}

export class Schema implements Options {
  path = '.';
  git = true;
  dryRun = false;
  diagnose = false;
  convert = false;
  prettify = false;
  move = false;
  file?: string;

  get onlyDiagnose(): boolean {
    return this.diagnose && !this.convert && !this.move && !this.prettify;
  }

  get onlyConvert(): boolean {
    return !this.diagnose && this.convert && !this.move && !this.prettify;
  }

  get onlyMove(): boolean {
    return !this.diagnose && !this.convert && this.move && !this.prettify;
  }

  get onlyPrettify(): boolean {
    return !this.diagnose && !this.convert && !this.move && this.prettify;
  }

  constructor(opts: Options) {
    const allSteps = !opts.diagnose && !opts.convert && !opts.move && !opts.prettify;
    Object.assign(
      this,
      {
        ...opts,
        path: resolve(opts.path),
        diagnose: allSteps || opts.diagnose,
        convert: allSteps || opts.convert,
        move: allSteps || opts.move,
        prettify: allSteps || opts.prettify,
      },
    );
  }

  withFile(file: string): Required<Schema> {
    return new Schema({ ...this, file }) as Required<Schema>;
  }

  isValid(file: string): boolean {
    return !file.includes('node_modules') && (this.isPug(file) || this.shouldPrettify(file));
  }

  isPug(file: string): boolean {
    return file.endsWith('.pug');
  }

  tsExists(file: string): boolean {
    return existsSync(file.replace(/\.pug$/, '.ts'));
  }

  shouldAnalize(file: string): boolean {
    return (this.diagnose || this.convert) && this.isPug(file);
  }

  shouldConvert(file: string): boolean {
    return this.convert && this.isPug(file);
  }

  shouldConvertCommit(): boolean {
    return this.convert && this.shouldCommit();
  }

  shouldCheckComponent(file: string): boolean {
    return this.shouldMove(file) && this.tsExists(file);
  }

  shouldMove(file: string): boolean {
    return this.move && file.endsWith('.pug');
  }

  shouldCommitMove(): boolean {
    return this.move && this.shouldCommit();
  }

  shouldPrettify(file: string): boolean {
    return this.prettify && file.endsWith('.html');
  }

  shouldCommitPrettify(): boolean {
    return this.prettify && this.shouldCommit();
  }

  private shouldCommit(): boolean {
    return !this.onlyDiagnose && this.git;
  }
}
