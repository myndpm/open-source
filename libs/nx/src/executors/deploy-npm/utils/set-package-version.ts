import { jsonRead, jsonWrite } from '@myndpm/utils';
import * as path from 'path';

export function setPackageVersion(dir: string, version: string) {
  const metadata = jsonRead(path.join(dir, 'package.json'));

  metadata.version = version;

  jsonWrite(path.join(dir, 'package.json'), metadata);
}
