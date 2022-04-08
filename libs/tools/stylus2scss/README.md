# @myndpm/stylus2scss

CLI utility to convert `styl` files to `scss`.  
It also updates Angular Components metadata.

## Usage

```bash
npx @myndpm/stylus2scss [--path <path>] [--git] [--dry-run]
  [--diagnose]
  [--convert] [--quote single|double] [--indent 2] [--autoprefixer] [--sign-comments]
  [--move]
  [--migrate]
```

- `--path <path>` Path to the directory for conversion. Default is current directory
- `--git` Convert and move files keeping the GIT history
- `--dry-run` Do not execute and print the steps
- `--diagnose` Only list and detect line endings on the existing stylesheets in the directory
- `--convert` Only convert the stylus contents to the target language
  - `--quote` Whether to use single or double quotes. Default is single
  - `--indent` Additional indent, useful for Vue
  - `--autoprefixer` Enable autoprefixed keyframes
  - `--comments` Safe conversion of inline comments
- `--move` Only move the stylus files to SCSS and update the related TS file
- `--migrate` Only run the sass-migration tool on the existing SCSS files

## Examples

Only diagnose the given path listing the files to process:

```bash
npx @myndpm/stylus2scss --path relative/path/ --diagnose [--git]
```

Only convert with some custom options:

```bash
npx @myndpm/stylus2scss --convert --quote double --autoprefixer
```

Only move the files and update the components but do not add the changes to git:

```bash
npx @myndpm/stylus2scss --move
```

Only migrate the existing scss files:

```bash
npx @myndpm/stylus2scss --migrate
```

Prints the files and commands that will be executed:

```bash
npx @myndpm/stylus2scss --dry-run [--git]
```

Perform all the conversion steps on the current folder and commits to git:

```bash
npx @myndpm/stylus2scss --git
```

## Troubleshooting

- Before you commit each step you can review the staged files in your IDE.

- If the sass-migrator fails because the stylus file had a faulty conversion,
  you can re-run with the `--migration` only option as many times as needed.

- The selector `&#id` produces a conversion error,
  you need to remove `&` and restore it later on.

## Credits

Based on [stylus-converter](https://github.com/txs1992/stylus-converter)
