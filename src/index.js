#!/usr/bin/env node

const path = require('path');
const getAllFiles = require('recursive-readdir');
const logger = require('./logger');
const calculate = require('./calculate');

const args = process.argv;
const directoryPath = process.cwd() + args[2];

function ignoreFile(file) {
  return path.extname(file) !== '' && path.extname(file) !== '.js';
}

getAllFiles(directoryPath, [ignoreFile])
  .then((files) => {
    logger.logInfo({ 'Number of scanned files': files.length });
    files.forEach((filename) => {
      calculate.resolveAndUpdatePaths(filename, directoryPath);
    });
  })
  .catch(error => logger.logError({
    description: `Unable to scan directory: ${directoryPath}`,
    error,
  }));
