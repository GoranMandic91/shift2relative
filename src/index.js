#!/usr/bin/env node

const path = require('path');
const getAllFiles = require('recursive-readdir');
const minimist = require('minimist');
const logger = require('./logger');
const calculate = require('./calculate');

const { root = '/', dry = false } = minimist(process.argv.slice(2));

function ignoreFile(file) {
  return path.extname(file) !== '' && path.extname(file) !== '.js';
}

const directoryPath = process.cwd() + root;

getAllFiles(directoryPath, [ignoreFile])
  .then((files) => {
    if (dry) {
      logger.logInfo('Results of test(dry) run:');
    }
    logger.logInfo({ 'Number of scanned files': files.length });
    files.forEach((filename) => {
      calculate.resolveAndUpdatePaths(filename, directoryPath, !!dry);
    });
  })
  .catch(error => logger.logError({
    description: `Unable to scan directory: ${directoryPath}`,
    error,
  }));
