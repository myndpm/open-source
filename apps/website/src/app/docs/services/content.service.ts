import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';
import { Observable } from 'rxjs';

declare var Prism: {
  highlightAllUnder: (element: Element | Document) => void;
};

/**
 * Based on ngx-markdown MarkdownService
 */
@Injectable()
export class ContentService {
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
  ) {}

  getFile(src: string): Observable<string> {
    return this.http.get(src, { responseType: 'text' });
  }

  handleExtension(src: string, content: string): string {
    const extension = src
      ? src.split('?')[0].split('.').splice(-1).join()
      : null;

    return extension !== 'md'
      ? '```' + extension + '\n' + content + '\n```'
      : content;
  }

  compile(markdown: string, decodeHtml = false): string {
    const trimmed = this.trimIndentation(markdown);
    const decoded = decodeHtml ? this.decodeHtml(trimmed) : trimmed;
    const compiled = marked(decoded, {
      renderer: new marked.Renderer(),
      breaks: false,
      gfm: true,
      headerIds: true,
      silent: !isDevMode(),
      smartLists: true,
      smartypants: true,
      xhtml: true,
    });
    return this.sanitizer.sanitize(SecurityContext.HTML, compiled) || '';
  }

  highlight(element?: Element | Document): void {
    if (typeof Prism !== 'undefined') {
      if (!element) {
        element = document;
      }
      const noLanguageElements = element.querySelectorAll('pre code:not([class*="language-"])');
      Array.prototype.forEach.call(noLanguageElements, (x: Element) => x.classList.add('language-none'));
      Prism.highlightAllUnder(element);
    }
  }

  private trimIndentation(markdown: string): string {
    if (!markdown) {
      return '';
    }
    let indentStart: number;
    return markdown
      .split('\n')
      .map(line => {
        let lineIdentStart = indentStart;
        if (line.length > 0) {
          lineIdentStart = isNaN(lineIdentStart)
            ? line.search(/\S|$/)
            : Math.min(line.search(/\S|$/), lineIdentStart);
        }
        if (isNaN(indentStart)) {
          indentStart = lineIdentStart;
        }
        return !!lineIdentStart
          ? line.substring(lineIdentStart)
          : line;
      }).join('\n');
  }

  private decodeHtml(html: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  }
}
