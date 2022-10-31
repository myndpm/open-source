import { jsonRead, jsonWrite } from '@myndpm/utils';
import * as path from 'path';

export function setPackageVersion(
  dir: string,
  version: string,
  dryRun = false
) {
  if (dryRun) {
    console.log(`setting ${version} into ${path.join(dir, 'package.json')}`);
  }

  const metadata = jsonRead(path.join(dir, 'package.json'));

  metadata.version = version;

  jsonWrite(path.join(dir, 'package.json'), metadata);
}

export function copyPackageVersion(
  origin: string,
  dest: string,
  dryRun = false
) {
  const metadata = jsonRead(path.join(origin, 'package.json'));

  if (dryRun) {
    console.log(
      `copying ${metadata.version} from ${path.join(
        origin,
        'package.json'
      )} to ${path.join(dest, 'package.json')}`
    );
  }

  setPackageVersion(dest, metadata.version);
}
