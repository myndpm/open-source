import path from 'path';

export default {
  async start(): Promise<void> {
    console.info(`@myndpm/stylus2scss started at ${path.resolve()}`);

    console.info('@myndpm/stylus2scss succeeded');
  }
}
