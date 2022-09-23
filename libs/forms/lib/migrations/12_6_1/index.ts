import { Rule, Tree } from '@angular-devkit/schematics';

export default function (): Rule {
  return (tree: Tree) => {
    return tree.visit((path) => {
      if (path.includes('node_modules')) {
        return;
      }

      if (path.endsWith('.html') || path.endsWith('.scss') || path.endsWith('.sass')) {
        const buffer = tree.read(path);
        if (!buffer) {
          return;
        }

        const content = buffer.toString('utf-8');

        let newContent = content
          // update the class renames
          .replace(/<dyn-factory/g, '<ng-container dynFactory')
          .replace(/<\/dyn-factory>/g, '</ng-container>')
          // css renames
          .replace(/dyn-factory/g, '.dyn-control');

        // overwrite the tree only if there was a replacement
        if (content !== newContent) {
          tree.overwrite(path, newContent);
        }
      }
    });
  };
}
