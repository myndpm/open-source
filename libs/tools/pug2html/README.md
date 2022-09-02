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

## Examples

Only diagnose the given path listing the files to process:

```bash
npx @myndpm/pug2html --path relative/path/ --diagnose [--git]
```

Only runs the pug conversion step:

```bash
npx @myndpm/pug2html --convert
```

Only move the files and update the components:

```bash
npx @myndpm/pug2html --move
```

Only prettify the existing html files:

```bash
npx @myndpm/pug2html --prettify
```

Prints the files and commands that will be executed:

```bash
npx @myndpm/pug2html --dry-run [--git]
```

Perform all the conversion steps on the current folder and commits to git:

```bash
npx @myndpm/pug2html --git
```

## Troubleshooting

- Before you commit each step you can review the staged files in your IDE.
- Search on a whole repo `let-`, `$implicit`, `ngForOf`. Check how it was used in the .pug file and revert if there are any differences.
- There might be issues with whitespaces since pug preprocess whitespaces and remove all of them. The only way to fix those - is to run build/unit tests/e2e-s. Most likely there will be no issues or impact will be minor.
- Search for `pug` inside your repo and remove any related code - builders, packages, scripts, etc.

## Known issues

There is a known issue with [$implicit](https://angular.io/api/common/NgTemplateOutlet). Search your codebase for `$implicit` and check how `let-` were converted.

```pug
ng-template([ngTemplateOutlet]="tmpl", [ngTemplateOutletContext]="{ $implicit: elem }")
ng-template(#tmpl, let-elem)
```

will be converted to

```html
<ng-template [ngTemplateOutlet]="tmpl" [ngTemplateOutletContext]="{ $implicit: elem }"></ng-template>
<ng-template #tmpl let-elem="elem"></ng-template>
<!-- but it should be -->
<ng-template [ngTemplateOutlet]="tmpl" [ngTemplateOutletContext]="{ $implicit: elem }"></ng-template>
<ng-template #tmpl let-elem></ng-template>
```

`let-elem="elem"` => `let-elem`

Another known issue is with [NgForOf](https://angular.io/api/common/NgForOf). Search your codebase for `ngForOf` and check how `let-` were converted.

```pug
ng-template(ngFor let-row [ngForOf]="rows" let-i="index")
  li ...
```

will be converted to

```html
<ng-template ngFor let-row="let-row" [ngForOf]="rows" let-i="index">
  <li>...</li>
</ng-template>
<!-- but it should be -->
<ng-template ngFor let-row [ngForOf]="rows" let-i="index">
  <li>...</li>
</ng-template>
```

`let-row="row"` => `let-row`
