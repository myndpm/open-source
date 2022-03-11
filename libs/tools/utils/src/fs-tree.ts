import { Stats, readdir, readFile, stat } from 'fs';
import { join } from 'path';

/**
 * Similar to @angular-devkit's Tree but basic one.
 */

export class FsTree {
  visit(path: string, callback: (path: string) => void): void {
    this.stat(path, (stats) => {
      if (stats.isDirectory()) {
        readdir(path, (err, files) => {
          if (err) throw err
          files.forEach((file) => {
            this.visit(join(path, file), callback)
          })
        })
      } else if (stats.isFile()) {
        callback(path)
      }
    })
  }

  read(filepath: string, callback: (content: string) => void): void {
    return readFile(filepath, (err, data) => {
      if (err) throw err
      callback(data?.toString() || '')
    });
  }

  stat(filepath: string, callback: (stats: Stats) => void) {
    stat(filepath, (err, stats) => {
      if (err) throw err
      callback(stats)
    })
  }
}
