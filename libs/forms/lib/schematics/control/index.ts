import { strings } from '@angular-devkit/core';
import {
   FileOperator,
   Rule,
   SchematicsException,
   Tree,
   apply,
   applyTemplates,
   chain,
   filter,
   forEach,
   mergeWith,
   move,
   noop,
   url,
 } from '@angular-devkit/schematics';
 import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
 import { addDeclarationToModule, addExportToModule } from '@schematics/angular/utility/ast-utils';
 import { InsertChange } from '@schematics/angular/utility/change';
 import { buildRelativePath, findModuleFromOptions } from '@schematics/angular/utility/find-module';
 import { applyLintFix } from '@schematics/angular/utility/lint-fix';
 import { parseName } from '@schematics/angular/utility/parse-name';
 import { validateHtmlSelector, validateName } from '@schematics/angular/utility/validation';
 import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';
 import { Schema as ComponentOptions } from './schema';

 function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
   const text = host.read(modulePath);
   if (text === null) {
     throw new SchematicsException(`File ${modulePath} does not exist.`);
   }
   const sourceText = text.toString('utf-8');

   return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
 }

 function addDeclarationToNgModule(options: ComponentOptions): Rule {
   return (host: Tree) => {
     if (!options.module) {
       return host;
     }

     options.type = options.type != null ? options.type : 'Component';

     const modulePath = options.module;
     const source = readIntoSourceFile(host, modulePath);

     const componentPath =
       `/${options.path}/` +
       (options.flat ? '' : strings.dasherize(options.name) + '/') +
       strings.dasherize(options.name) +
       (options.type ? '.' : '') +
       strings.dasherize(options.type);
     const relativePath = buildRelativePath(modulePath, componentPath);
     const classifiedName = strings.classify(options.prefix!) + strings.classify(options.name) + strings.classify(options.type);
     const declarationChanges = addDeclarationToModule(
       source,
       modulePath,
       classifiedName,
       relativePath,
     );

     const declarationRecorder = host.beginUpdate(modulePath);
     for (const change of declarationChanges) {
       if (change instanceof InsertChange) {
         declarationRecorder.insertLeft(change.pos, change.toAdd);
       }
     }
     host.commitUpdate(declarationRecorder);

     if (options.export) {
       // Need to refresh the AST because we overwrote the file in the host.
       const source = readIntoSourceFile(host, modulePath);

       const exportRecorder = host.beginUpdate(modulePath);
       const exportChanges = addExportToModule(
         source,
         modulePath,
         strings.classify(options.name) + strings.classify(options.type),
         relativePath,
       );

       for (const change of exportChanges) {
         if (change instanceof InsertChange) {
           exportRecorder.insertLeft(change.pos, change.toAdd);
         }
       }
       host.commitUpdate(exportRecorder);
     }

     return host;
   };
 }

 function buildSelector(options: ComponentOptions, projectPrefix: string) {
   let selector = strings.dasherize(options.name);
   if (options.prefix) {
     selector = `${options.prefix}-${selector}`;
   } else if (options.prefix === undefined && projectPrefix) {
     selector = `${projectPrefix}-${selector}`;
   }

   return selector;
 }

 export default function (options: ComponentOptions): Rule {
   return async (host: Tree) => {
     const workspace = await getWorkspace(host);
     const project = workspace.projects.get(options.project as string);

     if (options.path === undefined && project) {
       options.path = buildDefaultPath(project);
     }

     if (options.prefix === undefined && project) {
       options.prefix = project.prefix || '';
     }

     options.module = findModuleFromOptions(host, options);

     const parsedPath = parseName(options.path as string, options.name);
     options.name = parsedPath.name;
     options.path = parsedPath.path;
     options.selector =
       options.selector || buildSelector(options, (project && project.prefix) || '');

     validateName(options.name);
     validateHtmlSelector(options.selector);

     const templateSource = apply(url('./files'), [
       options.skipTests ? filter((path) => !path.endsWith('.spec.ts.template')) : noop(),
       applyTemplates({
         ...strings,
         'if-flat': (s: string) => (options.flat ? '' : s),
         ...options,
       }),
       !options.type
         ? forEach(((file) => {
             return file.path.includes('..')
               ? {
                   content: file.content,
                   path: file.path.replace('..', '.'),
                 }
               : file;
           }) as FileOperator)
         : noop(),
       move(parsedPath.path),
     ]);

     return chain([
       addDeclarationToNgModule(options),
       mergeWith(templateSource),
       options.lintFix ? applyLintFix(options.path) : noop(),
     ]);
   };
 }
