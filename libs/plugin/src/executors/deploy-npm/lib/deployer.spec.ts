import * as nxDevKit from '@nrwl/devkit';

import * as getLibOutputPathModule from '../utils/get-lib-output-path';
import deployer from './deployer';

describe('Deploy NPM package', () => {
  let context: nxDevKit.ExecutorContext;
  let outputPath: string;
  let runExecutorSpy: jest.SpyInstance;

  // Set this to false if you want to cause an error when building
  let shouldBuilderSuccess: boolean;

  const PROJECT = 'RANDOM-PROJECT';
  const mockEngine = {
    run: () => Promise.resolve(),
  };
  const getBuildTarget = (customConf = 'production'): string =>
    `${PROJECT}:build:${customConf}`;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    outputPath = `../../dist/randomness/${PROJECT}`;

    context = {
      root: 'random/system/path',
      projectName: PROJECT,
      target: {
        executor: 'nx:deploy-npm',
      },
    } as nxDevKit.ExecutorContext;

    shouldBuilderSuccess = true;
  });

  // Spyes
  beforeEach(() => {
    jest.spyOn(nxDevKit, 'readTargetOptions').mockImplementation(() => ({}));

    jest
      .spyOn(getLibOutputPathModule, 'getLibOutputPath')
      .mockImplementation(() => Promise.resolve(outputPath));

    runExecutorSpy = jest
      .spyOn(nxDevKit, 'runExecutor')
      .mockImplementation(() =>
        Promise.resolve({
          async *[Symbol.asyncIterator]() {
            yield {
              success: shouldBuilderSuccess,
            };
          },
        } as AsyncIterableIterator<{ success: boolean }>)
      );
  });

  it('should invoke the builder', async () => {
    await deployer(mockEngine, context, getBuildTarget(), { build: true });

    expect(runExecutorSpy).toHaveBeenCalledWith(
      {
        configuration: 'production',
        target: 'build',
        project: PROJECT,
      },
      {},
      context
    );
  });

  it('should invoke the builder with the right configuration', async () => {
    const customConf = 'my-custom-conf';

    await deployer(mockEngine, context, getBuildTarget(customConf), {
      build: true,
      target: customConf,
    });

    expect(runExecutorSpy).toHaveBeenCalledWith(
      {
        target: 'build',
        project: PROJECT,
        configuration: customConf,
      },
      expect.anything(),
      expect.anything()
    );
  });

  it('should not invoke the builder if the option --no-build is passed', async () => {
    await deployer(mockEngine, context, getBuildTarget(), {
      build: false,
    });

    expect(runExecutorSpy).not.toHaveBeenCalled();
  });

  describe('Error Handling', () => {
    it('throws if app building fails', async () => {
      shouldBuilderSuccess = false;

      try {
        await deployer(mockEngine, context, getBuildTarget(), {});
        fail('should cause an error');
      } catch (e: unknown) {
        expect(e instanceof Error).toBeTruthy();
      }
    });
  });
});
