import { existsSync, readFileSync, writeFileSync } from 'fs';

/**
 * Sync operations to manipulate JSON files.
 */

const defaultPath = 'package.json';

export function jsonExists(path: string = defaultPath): boolean {
  return existsSync(path);
}

export function jsonRead(path: string = defaultPath, field?: string): any {
  if (jsonExists(path)) {
    const jsonFile = jsonParse(readFileSync(path, { encoding: 'utf8' }));
    if (field && jsonFile.hasOwnProperty(field)) {
      return jsonFile[field];
    }
    return jsonFile;
  }
  return field ? null : {};
}

export function jsonParse(content: string): any {
  try {
    // parse the data
    return JSON.parse(content);
  } catch (e) {
    // filter any existing comments
    return JSON.parse(content.split('\n').filter(line => !line.match(/^\s*?\//)).join('\n'));
  }
}

export function jsonWrite(path: string, packageJson: any): void {
  return writeFileSync(path, `${JSON.stringify(packageJson, null, 2)}\n`, { encoding: 'utf8' });
}
