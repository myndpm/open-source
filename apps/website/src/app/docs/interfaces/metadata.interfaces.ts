/**
 * Structure of the JSON root index
 */

export type DocsLocalized = { [lang: string]: string };

export interface DocsIndex {
  [url: string]: DocsMetadata;
}

export interface DocsMetadata {
  title: DocsLocalized;
  content?: DocsLocalized; // README.lang.md
  files?: string[]; // file-paths
  redirectTo?: string;
  sourceLink?: string;
}

/**
 * Structure of each folder JSON
 */
export interface DocsModule {
  path: string;
  title: DocsLocalized;
  content?: DocsLocalized; // README.lang.md
  files?: string[]; // file-paths
  redirectTo?: string;
  sourceLink?: string;
}
