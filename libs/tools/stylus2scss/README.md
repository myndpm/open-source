# @myndpm/stylus2scss

CLI utility to convert `styl` files to `scss`.  
It also updates Angular Components metadata.

## Usage

```bash
npx @myndpm/stylus2scss [--path <path>] [--commit] [--no-git] [--dry-run]
  [--diagnose]
  [--convert] [--quote single|double] [--indent 2] [--autoprefixer] [--sign-comments]
  [--migrate]
```

- `--path <path>` Path to the directory for conversion. Default is current directory
- `--commit` Interactively asks for the commit message after convert and migrate
- `--no-git` Adds and move the files with GIT control version
- `--dry-run` Do not execute and print the steps
- `--diagnose` Only list and detect line endings on the existing stylesheets in the directory
- `--convert` Only convert the stylus contents to the target language
  * `--quote` Whether to use single or double quotes. Default is single
  * `--indent` Additional indent, useful for Vue
  * `--autoprefixer` Enable autoprefixed keyframes
  * `--sign-comments` Sign inline comments for a safe conversion
- `--migrate` Only run the sass-migration tool on the existing SCSS files

## Credits

Based on [stylus-converter](https://github.com/txs1992/stylus-converter)
