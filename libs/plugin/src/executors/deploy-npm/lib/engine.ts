import { exec } from '@myndpm/utils';
import { logger } from '@nrwl/devkit';

import { prepareOptions, setPackageVersion } from '../utils';
import { DeployNpmExecutorSchema } from '../schema';

export async function run(dir: string, options: DeployNpmExecutorSchema) {
  try {
    options = prepareOptions(options);

    if (options.dryRun) {
      logger.info(`The package is not going to be published\n`);
    }

    /*
    Modifying the dist when the user is dry-run mode,
    thanks to the Nx Cache could lead to leading to publishing and unexpected package version
    when the option is removed
    */
    if (options.version && !options.dryRun) {
      await setPackageVersion(dir, options.version);
    }

    const npmOptions = extractOnlyNPMOptions(options);

    const { stdout, stderr } = await exec(
      `npm publish "${dir}"`,
      npmOptions,
      npmOptions
    ).toPromise();

    if (options.dryRun) {
      logger.info(`\nThe options are:`);
      logger.info(JSON.stringify(options, null, 1));
    } else {
      logger.info(stdout);
      logger.info(stderr);
    }
  } catch (error) {
    if (options.exception) {
      throw error;
    } else {
      logger.error(error);
    }
  }
}

/**
 * Extract only the options that the `npm publish` command can process
 *
 * @param options All the options sent to the executor
 */
function extractOnlyNPMOptions({
  access,
  tag,
  otp,
  dryRun,
  registry,
}: DeployNpmExecutorSchema): Record<string, any> {
  return {
    access,
    tag,
    otp,
    dryRun,
    registry,
  };
}
