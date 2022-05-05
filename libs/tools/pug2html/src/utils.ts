import chalk from 'chalk';

// logging

export function logTitle(...rest: string[]): void {
  console.log(chalk.cyanBright(rest));
}

export function logInfo(...rest: string[]): false {
  console.log(chalk.dim(...rest));
  return false;
}

export function logNote(...rest: string[]): void {
  console.log(chalk.yellow(rest));
}
