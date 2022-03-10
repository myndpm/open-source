# @myndpm/stylus2scss

CLI utility to convert `styl` files to `scss`.  
It also updates Angular Components metadata.

## Usage

```bash
npx @myndpm/stylus2scss [--path <path>] [--diagnose] [--only-migrate]
```

`<path>` - Path to the directory for conversion. Default is current directory
`diagnose` - Show a report of the existing stylesheets in the directory
`only-migrate` - Only run the sass-migration tool on the SCSS files
