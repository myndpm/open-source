import { DeployNpmExecutorSchema } from './schema';

export default async function runExecutor(
  options: DeployNpmExecutorSchema,
) {
  console.log('Executor ran for DeployNpm', options)
  return {
    success: true
  }
}

