import { ExecutorContext, logger } from '@nrwl/devkit';
import deployer from './lib/deployer';
import * as engine from './lib/engine';
import { DeployNpmExecutorSchema } from './schema';

export default async function runExecutor(
  options: DeployNpmExecutorSchema,
  context: ExecutorContext
) {
  const buildTarget = `${context.projectName}${
    options.target ? `:${options.target}` : ':build'
  }`;
  const outputTarget = `${context.projectName}${
    options.outputTarget ? `:${options.outputTarget}` : ':build'
  }`;

  try {
    await deployer(engine, context, buildTarget, outputTarget, options);
    logger.info(`\n🚀 ${context.projectName} published successfully!`);
  } catch (e) {
    logger.error(`\n❌ error while trying to publish ${context.projectName}`);
    logger.error(e.stderr || e);
    return { success: false };
  }

  return { success: true };
}
