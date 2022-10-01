import {
  ExecutorContext,
  logger,
  parseTargetString,
  readTargetOptions,
  runExecutor,
  Target,
} from '@nrwl/devkit';

import { DeployNpmExecutorSchema } from '../schema';
import { getLibOutputPath } from '../utils';

export default async function deployer(
  engine: {
    run: (dir: string, options: DeployNpmExecutorSchema) => Promise<void>;
  },
  context: ExecutorContext,
  buildTarget: string,
  outputTarget: string,
  options: DeployNpmExecutorSchema
) {
  let targetDescription = parseTargetString(buildTarget);

  if (!options.build || options.dryRun) {
    logger.info(`\n📦 Skipping build\n`);
  } else {
    await buildLibrary(context, buildTarget, parseTargetString(buildTarget));
  }

  let outputPath = options.outputPath;

  if (!outputPath) {
    if (outputTarget) {
      targetDescription = parseTargetString(outputTarget);
    }

    const buildOptions = readTargetOptions(targetDescription, context);

    outputPath = await getLibOutputPath(
      context.root,
      buildOptions,
      targetDescription.project
    );
  }

  await engine.run(outputPath, options);
}

async function buildLibrary(
  context: ExecutorContext,
  target: string,
  targetDescription: Target
) {
  if (!context.target) {
    throw new Error('Cannot execute the build target');
  }

  logger.info(`\n📦 Building "${target}"\n`);

  const buildResult = await runExecutor(targetDescription, {}, context);

  for await (const output of buildResult) {
    if (!output.success) {
      throw new Error('Could not build the library');
    }
  }
}
