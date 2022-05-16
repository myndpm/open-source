# @myndpm/pug2html

CLI utility to convert `pug` content to `html`.  
Also converts inline `template` metadata and rename `.pug` extension to `.html`

## Usage

```bash
npx @myndpm/pug2html [--path <path>] [--git] [--dry-run]
  [--diagnose]
  [--convert]
  [--move]
  [--prettify]
```

- `--path <path>` - Path to the directory for conversion. Default is current directory
- `--git` Convert and move files keeping the GIT history
- `--dry-run` Do not execute and just print the steps
- `--diagnose` Only list and detect line endings on the existing stylesheets in the directory
- `--convert` Only convert the pug contents to html
- `--move` Only move the pug files to HTML and update the related TS files
- `--prettify` Only prettify the converted files

## Migration guide
1. Before you commit each step you can review the staged files in your IDE.
2. Search on a whole repo let-, $implicit, ngForOf. Check how it was used in the .pug file and revert if there are any differences. 
3. There is a known issue with [$implicit](https://angular.io/api/common/NgTemplateOutlet). Search your codebase for `$implicit` and check how `let-` were converted.
```pug
ng-template([ngTemplateOutlet]="tmpl", [ngTemplateOutletContext]="{ $implicit: elem }")

ng-template(#tmpl, let-elem)
```
will be converted to
```html
<ng-template [ngTemplateOutlet]="tmpl" [ngTemplateOutletContext]="{ $implicit: elem }"></ng-template>
<ng-template #tmpl let-elem="elem"></ng-template>
```
but it should be
```html
<ng-template [ngTemplateOutlet]="tmpl" [ngTemplateOutletContext]="{ $implicit: elem }"></ng-template>
<ng-template #tmpl let-elem></ng-template>
```
let-elem="elem" => let-elem

4.Another known issue is with [NgForOf](https://angular.io/api/common/NgForOf). Search your codebase for `ngForOf` and check how `let-` were converted.
```pug
ng-template(ngFor let-row [ngForOf]="rows" let-i="index")
  li ...
```
will be converted to
```html
<ng-template ngFor let-row="let-row" [ngForOf]="rows" let-i="index">
  <li>...</li>
</ng-template>
```
but it should be
```html
<ng-template ngFor let-row [ngForOf]="rows" let-i="index">
  <li>...</li>
</ng-template>
```
let-row="row" => let-row

5. There might be issues with whitespaces since pug preprocess whitespaces and remove all of them. The only way to fix those - is to run build/unit tests/e2e-s. Most likely there will be no issues or impact will be minor.
6. Search for `pug` inside your repo and remove any related code - builders, packages, scripts, etc.
