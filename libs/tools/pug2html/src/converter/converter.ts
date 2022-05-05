import pug from 'pug';

export  function converter(content: string): string {
  return pug
    .render(content.trim(), { pretty: true })
    // let-column="let-column" -> let-column="column"
    .replace(/(let-([\S]*?))="\1"/g, (match: string, g1: string, g2: string) => `${g1}="${g2}"`)
    /**
     * *ngSwitchDefault="*ngSwitchDefault" -> *ngSwitchDefault
     * | @css="@css" -> @css
     * #template="#template" -> #template
     */
    .replace(/([*@#][\S]*?)="\1"/g, (match: string, g1: string) => g1)
    /**
     * ngFor="ngFor" -> ngFor
     * download="download" -> download
     * custom-directive="custom-directive" -> custom-directive
     */
    .replace(/[\s]([\S]*?)="\1"/g, (match: string, g1: string) => ` ${g1}`)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}
