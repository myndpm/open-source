import { DeployDockerExecutorSchema } from './schema';

export default async function runExecutor(options: DeployDockerExecutorSchema) {
  console.log('Executor ran for DeployDocker', options);
  return {
    success: true,
  };
}
