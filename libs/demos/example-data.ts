import EXAMPLE_COMPONENTS from './examples.json';

export interface NgModuleInfo {
  /** Name of the NgModule. */
  name: string;
  /**
   * Import specifier that resolves to this module. The specifier is not scoped to
   * `@myndpm/demos` because it's up to the consumer how the module is
   * imported. For example, in the docs, modules are lazily imported from `fesm2015/`.
   */
  importSpecifier: string;
}

export interface LiveExample {
  /** Id of the example. */
  id: string;
  /** Title of the example. */
  title: { [lang: string]: string };
  /** Name of the example component. */
  componentName: string;
  /** Selector to match the component of this example. */
  selector: string;
  /** Path to the directory containing the example. */
  filesPath: string;
  /** Name of the primary file of this example. */
  primaryFile: string;
  /** List of files which are part of the example. */
  files: string[];
  /** List of additional components which are part of the example. */
  additionalComponents: string[];
  /** NgModule that declares this example. */
  module: NgModuleInfo;
}

export interface ExamplesIndex {
  [id: string]: LiveExample;
}

/**
 * Example data with information about component name, selector, files used in
 * example, and path to examples.
 */
 export class ExampleData {
  /** Description of the example. */
  description!: string;

  /** List of files that are part of this example. */
  exampleFiles!: string[];

  /** Selector name of the example component. */
  selectorName!: string;

  /** Name of the file that contains the example component. */
  indexFilename!: string;

  /** Names of the components being used in this example. */
  componentNames!: string[];

  constructor(example: string, lang = 'en') {
    if (!example || !EXAMPLE_COMPONENTS.hasOwnProperty(example)) {
      return;
    }

    const {
      componentName,
      files,
      selector,
      primaryFile,
      additionalComponents,
      title
    } = (EXAMPLE_COMPONENTS as unknown as ExamplesIndex)[example];

    const exampleName = example.replace(/(?:^\w|\b\w)/g, letter => letter.toUpperCase());

    this.exampleFiles = files;
    this.selectorName = selector;
    this.indexFilename = primaryFile;
    this.description = title[lang] || exampleName.replace(/[\-]+/g, ' ') + ' Example';
    this.componentNames = [componentName, ...additionalComponents];
  }
}
