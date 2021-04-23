/**
 * Structure of the JSON files
 */
export interface DocsIndex {
  [url: string]: DocsMetadata;
}

export interface DocsMetadata {
  title: { [lang: string]: string };
  files: string[]; // file-paths
}

export interface DocsModule {
  path: string;
  title: { [lang: string]: string };
  content: { [lang: string]: string }; // README.lang.md
  files: string[]; // file-paths
}
