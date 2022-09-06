import { Rule, Tree } from '@angular-devkit/schematics';

export default function (): Rule {
  return (tree: Tree) => {
    return tree.visit((path) => {
      if (path.includes('node_modules') || !path.endsWith('.ts')) {
        return;
      }

      const buffer = tree.read(path);
      if (!buffer) {
        return;
      }

      const content = buffer.toString('utf-8');

      const newContent = content
        // update the class renames
        .replace(/DynControlType/g, 'DynControlId')
        .replace(/DynControlParams/g, 'DynParams')
        .replace(/DynControlMode/g, 'DynMode')
        .replace(/DynControlFunctionFn/g, 'DynFunctionFn')
        .replace(/DynControlConditionFn/g, 'DynConditionFn')
        .replace(/DynControlMatch/g, 'DynMatch')
        .replace(/DynControlRelated/g, 'DynMatchRelation')
        .replace(/DynControlVisibility/g, 'DynVisibility')
        .replace(/DynControlValidator/g, 'DynValidator')
        .replace(/DynControlAsyncValidator/g, 'DynAsyncValidator')
        .replace(/DynTreeNode/g, 'DynNode')
        .replace(/DynControlNode/g, 'DynControlBase')
        .replace(/DynFormTreeNode/g, 'DynControlNode')
        .replace(/DynFormConfigResolver/g, 'DynFormResolver')
        .replace(/DynControlHook/g, 'DynHook')
        .replace(/DynControlErrors/g, 'DynErrors')

        // control provision change
        .replace(/\{.*?(\w+)\.dynControl,?.*?\}(,)?/gs, '$1$2');

      // overwrite the tree only if there was a replacement
      if (content !== newContent) {
        tree.overwrite(path, newContent);
      }
    });
  };
}
