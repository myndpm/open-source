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
