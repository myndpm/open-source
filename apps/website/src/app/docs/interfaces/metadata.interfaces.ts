/**
 * Structure of the JSON root index
 */
export interface DocsIndex {
  [url: string]: DocsMetadata;
}

export interface DocsMetadata {
  title: { [lang: string]: string };
  files?: string[]; // file-paths
  redirectTo?: string;
  sourceLink?: string;
}

/**
 * Structure of each folder JSON
 */
export interface DocsModule {
  path: string;
  title: { [lang: string]: string };
  content?: { [lang: string]: string }; // README.lang.md
  files?: string[]; // file-paths
  redirectTo?: string;
  sourceLink?: string;
}
