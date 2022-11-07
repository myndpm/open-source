import { DeployNpmExecutorSchema } from '../schema';

export enum npmAccess {
  public = 'public',
  restricted = 'restricted',
}

export type NpmPublishOptions = Pick<
  DeployNpmExecutorSchema,
  'access' | 'tag' | 'otp' | 'dryRun' | 'exception'
>;

export const defaults: NpmPublishOptions = {
  tag: undefined,
  access: npmAccess.public,
  otp: undefined,
  dryRun: false,
  exception: false,
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
