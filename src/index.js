#!/usr/bin/env node

const path = require('path');
const getAllFiles = require('recursive-readdir');
const minimist = require('minimist');
const logger = require('./logger');
const calculate = require('./calculate');

const { root, dryRun } = minimist(process.argv.slice(2));

function ignoreFile(file) {
  return path.extname(file) !== '' && path.extname(file) !== '.js';
}

if (!root) {
  logger.logError({ error: 'Need to specify root directory! Example: npx shift2relative --root=path' });
} else {
  const directoryPath = process.cwd() + root;

  getAllFiles(directoryPath, [ignoreFile])
    .then((files) => {
      logger.logInfo({ 'Number of scanned files': files.length });
      files.forEach((filename) => {
        calculate.resolveAndUpdatePaths(filename, directoryPath, !!dryRun);
      });
    })
    .catch(error => logger.logError({
      description: `Unable to scan directory: ${directoryPath}`,
      error,
    }));
}
