/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { strings } from '@angular-devkit/core';
import {
  Rule,
  Tree,
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  schematic,
  noop,
  url,
} from '@angular-devkit/schematics';
import { Schema as ComponentOptions } from '../control/schema';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';
import { applyLintFix } from '@schematics/angular/utility/lint-fix';
import { parseName } from '@schematics/angular/utility/parse-name';
import { createDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';
import { Schema as ModuleOptions } from './schema';

export default function (options: ModuleOptions): Rule {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project as string);

    if (options.path === undefined) {
      options.path = await createDefaultPath(host, options.project as string);
    }

    if (options.module) {
      options.module = findModuleFromOptions(host, options);
    }

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    const values = {
      prefix: project?.prefix,
    }

    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...strings,
        'if-flat': (s: string) => (options.flat ? '' : s),
        ...options,
        ...values,
      }),
      move(parsedPath.path),
    ]);
    const moduleDasherized = strings.dasherize(options.name);
    const controlDasherized = strings.dasherize(options.controlName);
    const controlPath = `${options.path}/${
      !options.flat ? `${moduleDasherized}/` : ''
    }${options.controlPath}`;

    const componentOptions: ComponentOptions = {
      project: options.project,
      path: controlPath,
      name: controlDasherized,
      type: options.type,
      id: options.id || 'CONTROL',
      instance: options.instance || 'Control',
      flat: options.flat,
      prefix: values.prefix,
    };

    return chain([
      mergeWith(templateSource),
      schematic('control', componentOptions),
      options.lintFix ? applyLintFix(options.path) : noop(),
    ]);
  };
}
