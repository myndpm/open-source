import fs from 'fs';
import path from 'path';
import prettier, { Options } from 'prettier';
import pug from 'pug';

const excludeFolders = [
  'node_modules',
  'dist',
];

const prettierOptions: Options = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  htmlWhitespaceSensitivity: 'strict',
  bracketSpacing: true,
  arrowParens: 'always',
  proseWrap: 'always',
  endOfLine: 'auto',
  parser: 'angular',
};

function formatHtmlContent(content: string): string {
  const pugRenderResult =
    pug
      .render(content.trim(), { pretty: true })
      /**
       * #template="#template" -> #template
       * | @css="@css" -> @css
       * *ngSwitchDefault="*ngSwitchDefault" -> *ngSwitchDefault
       */
      .replace(/([*@#][\S]*?)="\1"/g, (match: string, g1: string) => g1)
      // let-column="let-column" -> let-column="column"
      .replace(/(let-([\S]*?))="\1"/g, (match: string, g1: string, g2: string) => `${g1}="${g2}"`)
      // ngFor="ngFor" -> ngFor
      .replace(/(ngFor)="\1"/g, (match: string, g1: string) => g1)
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');

  return prettier.format(pugRenderResult, prettierOptions);
}

async function getFolderPath(): Promise<string> {
  const defaultPath = './';
  const pathToDir = process.argv[2];

  if (!pathToDir) return defaultPath;

  try {
    if ((await fs.promises.stat(pathToDir)).isDirectory()) return pathToDir;
  } catch (error) {
    console.error(`ERROR: wrong initial path ${pathToDir}`, error);
    throw error;
  }

  throw new Error(`ERROR: wrong initial path ${pathToDir}`);
}

async function forEachFileInFolder(folderPath: string, fns: ((filePath: string) => Promise<void>)[]): Promise<void> {
  for (const content of await fs.promises.readdir(folderPath)) {
    if (excludeFolders.some(eF => eF === content.toLowerCase())) continue;

    const absolutePath = path.join(folderPath, content);
    if ((await fs.promises.stat(absolutePath)).isDirectory()) {
      await forEachFileInFolder(absolutePath, fns);
    } else {
      for (const fn of fns) {
        await fn(absolutePath);
      }
    }
  }
}

function changeExtension(filePath: string, extension: string): string {
  const basename = path.basename(filePath, path.extname(filePath));
  return path.join(path.dirname(filePath), basename + extension);
}

async function convertPugContent(filePath: string): Promise<void> {
  if (!filePath.toLowerCase().endsWith('.pug')) return;

  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    await fs.promises.writeFile(changeExtension(filePath, '.html'), formatHtmlContent(content));
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error(`ERROR: convert pug content failed while processing ${filePath}`, error);
    throw error;
  }
  console.info(`${filePath} converted successfully`);
}

async function convertComponentTsContent(filePath: string): Promise<void> {
  const filePathToLower = filePath.toLowerCase();
  if (filePathToLower.endsWith('.component.ts')) {
    await convertTsInlineTemplate(filePath);
    await convertTsInlineUrlExtension(filePath);
  } else if (filePathToLower.endsWith('.stories.ts')) {
    await convertTsInlineTemplate(filePath);
  } else {
    return;
  }
  console.info(`${filePath} converted successfully`);
}

async function convertTsInlineTemplate(filePath: string): Promise<void> {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const replacer = (_: string, g1: string, g2: string, g3: string, g4: string) =>
      `${g1}${g2}${formatHtmlContent(g3).trim()}${g4}`;
    const newFileContents = content.replace(/((?:template|code):[\r\n\s]*?)(['"`])([\s\S]*?)(\2)/g, replacer);
    await fs.promises.writeFile(filePath, newFileContents);
  } catch (error: any) {
    const msg = `ERROR: convert inline template failed while processing ${filePath}. Please, review possible errors.`;
    const details = `${error.code}: ${error.msg} at Pug:${error.line}:${error.column}`;
    console.error(`${msg} ${details}`);
  }
}

async function convertTsInlineUrlExtension(filePath: string): Promise<void> {
  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const replacer = (match: string, g1: string, g2: string, g3: string, g4: string, g5: string) =>
      `${g1}${g2}${g3}.html${g5}`;
    const newFileContents = content.replace(/(templateUrl:[\r\n\s]*?)(['"`])([\s\S]*?)([.]pug)(\2)/, replacer);
    await fs.promises.writeFile(filePath, newFileContents);
  } catch (error) {
    console.error(`ERROR: convert inline url extension failed while processing ${filePath}`, error);
    throw error;
  }
}

export default {
  async start(): Promise<void> {
    console.info(`@myndpm/pug2html started at ${path.resolve()}`);

    await forEachFileInFolder(await getFolderPath(), [convertPugContent, convertComponentTsContent]);

    console.info('@myndpm/pug2html succeeded');
  }
}
