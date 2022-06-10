import { DeployDockerExecutorSchema } from './schema';
import executor from './executor';

const options: DeployDockerExecutorSchema = {};

describe('DeployDocker Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});