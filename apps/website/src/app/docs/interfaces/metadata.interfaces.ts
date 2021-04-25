export type DocsLocalized = { [lang: string]: string };

/**
 * Documentation JSON index
 */

export interface DocsIndex {
  [url: string]: DocsMetadata;
}

export interface DocsMetadata {
  title: DocsLocalized;
  content?: DocsLocalized; // README[.lang].md
  examples?: string[]; // example IDs
  redirectTo?: string;
  sourceLink?: string;
}
