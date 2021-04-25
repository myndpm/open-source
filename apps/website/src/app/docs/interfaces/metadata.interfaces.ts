export type DocsLocalized = { [lang: string]: string };

export interface DocsExample {
  title: DocsLocalized;
  files?: string[]; // file-paths
}

/**
 * Structure of each folder JSON
 */
 export interface DocsModule {
  path: string;
  title: DocsLocalized;
  content?: DocsLocalized; // README.lang.md
  examples?: DocsExample[];
  redirectTo?: string;
  sourceLink?: string;
}

/**
 * Structure of the JSON root index
 */

export interface DocsIndex {
  [url: string]: DocsMetadata;
}

export interface DocsMetadata {
  title: DocsLocalized;
  content?: DocsLocalized; // README.lang.md
  examples?: DocsExample[];
  redirectTo?: string;
  sourceLink?: string;
}
