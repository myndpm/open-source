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
  * `--comments` Safe conversion of inline comments
- `--migrate` Only run the sass-migration tool on the existing SCSS files

## Examples

List, convert and migrate a path renaming the files:

```bash
npx @myndpm/stylus2scss --path relative/path/
```

Convert and migrate the current folder and commit to git:

```bash
npx @myndpm/stylus2scss --commit
```

Only convert with some custom options:

```bash
npx @myndpm/stylus2scss --convert --quote double --autoprefixer
```

Only migrate the files but do not add the changes to git:

```bash
npx @myndpm/stylus2scss --migrate --no-git
```

## Troubleshooting

If the sass-migrator fails because the stylus file had a faulty conversion,
this script can re-run with the migration only.

## Credits

Based on [stylus-converter](https://github.com/txs1992/stylus-converter)
