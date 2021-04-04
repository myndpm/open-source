import { readFileSync, writeFileSync } from 'fs';
import { echo, exit, test } from 'shelljs';

const [lib] = process.argv.slice(2)

if (!lib || !test('-f', `${lib}/package.json`)) {
  echo('npm-peer-deps: invalid library path');
  exit(1);
}

const packageJson = `./dist/${lib}/package.json`;
const jsonFile = JSON.parse(readFileSync(packageJson, { encoding: 'utf8' }));

switch (jsonFile.name) {
  case '@myndpm/dyn-forms':
    delete jsonFile['peerDependencies']['@angular/material'];
    writeFileSync(`dist/${lib}/package.json`, `${JSON.stringify(jsonFile, null, 2)}\n`);
    break;
}
