import { jsonRead } from '@myndpm/utils';
import * as path from 'path';

type IBuildOptions = {
  outputPath?: string;
  tsConfig?: string;
  project?: string;
};

export function getLibPath(
  projectRoot: string,
  buildOptions: IBuildOptions,
  libName: string
): string {
  if (!buildOptions.tsConfig || typeof buildOptions.tsConfig !== 'string') {
    throw new Error(
      `Cannot read the tsConfig path option of the library '${libName}' in the workspace`
    );
  }

  const tsConfigPath = path.join(projectRoot, buildOptions.tsConfig);

  return path.dirname(tsConfigPath);
}

export async function getLibOutputPath(
  projectRoot: string,
  buildOptions: IBuildOptions,
  libName: string
): Promise<string> {
  if (buildOptions.outputPath) {
    return withOutputPath();
  } else {
    return withoutOutputPath();
  }

  function withOutputPath() {
    if (
      !buildOptions.outputPath ||
      typeof buildOptions.outputPath !== 'string'
    ) {
      throw new Error(
        `Cannot read the project output path option of the library '${libName}' in the workspace`
      );
    }

    return path.join(projectRoot, buildOptions.outputPath);
  }

  async function withoutOutputPath() {
    if (!buildOptions.project || typeof buildOptions.project !== 'string') {
      throw new Error(
        `Cannot read the project path option of the library '${libName}' in the workspace`
      );
    }

    const ngPackagePath = path.join(projectRoot, buildOptions.project);

    let ngPackageContent: any;

    try {
      ngPackageContent = jsonRead(ngPackagePath);
    } catch (error) {
      throw new Error(`Error reading the ng-package.json`);
    }

    if (!ngPackageContent.dest || typeof ngPackageContent.dest !== 'string') {
      throw new Error(
        `Cannot read the project 'dest' option of the ng-package.json`
      );
    }

    const outputPath = path.join(
      path.dirname(ngPackagePath),
      ngPackageContent.dest
    );

    return outputPath;
  }
}
