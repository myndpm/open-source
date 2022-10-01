export interface DeployNpmExecutorSchema {
  /**
   * Run the build during deployment.
   */
  build?: boolean;
  /**
   * The output path to version and publish (does override outputTarget).
   */
  outputPath?: string;
  /**
   * A named target to extract the options.outputPath (uses the same build target if not provided).
   */
  outputTarget?: string;
  /**
   * A named target with an optional `configuration`. This is equivalent to calling the command `nx run project:$target`.
   */
  target?: string;
  /**
   * The version that your package is going to be published. Ex: '1.3.5' '2.0.0-next.0'
   */
  version?: string;
  /**
   * Registers the published package with the given tag, such that `npm install @` will install this version. By default, `npm publish` updates and `npm install` installs the `latest` tag. See `npm-dist-tag` for details about tags.
   */
  tag?: string;
  /**
   * NPM registry URL (Defaults to https://registry.npmjs.org).
   */
  registry?: string;
  /**
   * Tells the registry whether this package should be published as public or restricted. Only applies to scoped packages, which default to restricted. If you don’t have a paid account, you must publish with --access public to publish scoped packages.
   */
  access?: string;
  /**
   * If you have two-factor authentication enabled in auth-and-writes mode then you can provide a code from your authenticator with this. If you don’t include this and you’re running from a TTY then you’ll be prompted.
   */
  otp?: number;
  /**
   * For testing: Run through without making any changes. Execute with --dry-run and nothing will happen.
   */
  dryRun?: boolean;
}
