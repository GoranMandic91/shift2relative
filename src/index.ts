#!/usr/bin/env node

import * as path from 'path';
import * as getAllFiles from 'recursive-readdir';
import * as minimist from 'minimist';
import Logger from './logger';
import Calculate from './calculate';

function ignoreFile(file) {
  return path.extname(file) !== '' && path.extname(file) !== '.js';
}

class Shift2Relative {
  private directoryPath: string;
  private root: string;
  private dry: boolean;
  private calculate: Calculate;
  private logger: Logger;

  constructor(root: string, dry: boolean) {
    this.root = root;
    this.dry = !!dry;

    this.directoryPath = process.cwd() + this.root;
    this.calculate = new Calculate(this.directoryPath, this.dry);
    this.logger = new Logger();
  }

  public async run() {
    try {

      const files = await getAllFiles(this.directoryPath, [ignoreFile])
      if (dry) {
        this.logger.info('Results of test(dry) run:');
      }
      this.logger.info({ 'Number of scanned files': files.length });
      files.forEach((filename) => {
        this.calculate.resolveAndUpdatePaths(filename);
      });

    } catch (error) {
      this.logger.error({
        description: `Unable to scan directory: ${this.directoryPath}`,
        error,
      })
    }
  }
}

const { root = '/', dry = false } = minimist(process.argv.slice(2));
const s2r = new Shift2Relative(root, dry);
s2r.run();

