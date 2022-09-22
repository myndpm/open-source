import { DeployNpmExecutorSchema } from '../schema';

export enum npmAccess {
  public = 'public',
  restricted = 'restricted',
}

export type NpmPublishOptions = Pick<
  DeployNpmExecutorSchema,
  'access' | 'tag' | 'otp' | 'dryRun'
>;

export const defaults: NpmPublishOptions = {
  tag: undefined,
  access: npmAccess.public,
  otp: undefined,
  dryRun: false,
};

export function prepareOptions(
  origOptions: DeployNpmExecutorSchema
): DeployNpmExecutorSchema {
  const options = {
    ...defaults,
    ...origOptions,
  };

  return options;
}
