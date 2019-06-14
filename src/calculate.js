const fs = require('fs');
const path = require('path');
const logger = require('./logger');

function findRelativePaths(arrayOfAbsRequires, filename, directoryPath) {
  const arrayOfRelRequires = [];
  const requires = {};
  arrayOfAbsRequires.forEach((element, index) => {
    const elementPath = element.substring(9, element.length - 2);
    try {
      const absPath = require.resolve(elementPath, { paths: [directoryPath] });
      let relPath = path.relative(path.dirname(filename), absPath);
      if (!relPath.includes('/') || !relPath.includes('..')) {
        relPath = `./${relPath}`;
      }
      relPath = relPath.substring(0, relPath.lastIndexOf('.'));
      arrayOfRelRequires.push(relPath);
      requires[arrayOfAbsRequires[index]] = `require('${relPath}')`;
    } catch (error) {
      logger.logError({ description: filename, error });
    }
  });
  logger.logInfo({
    [filename]:
      Object.keys(requires).length !== 0 ? requires : 'No changes in file',
  });
  return arrayOfRelRequires;
}

function resolveAndUpdatePaths(filename, directoryPath) {
  fs.readFile(filename, 'utf8', (error, data) => {
    if (error) {
      return logger.logError({
        description: `Error during ${filename} read `,
        error,
      });
    }
    let arrayOfAbsRequires = data.match(/require\('(.*?)'\)/g) || [];
    arrayOfAbsRequires = arrayOfAbsRequires.filter(r => r.substring(9, r.length - 2).includes('/'));
    let arrayOfRelRequires = findRelativePaths(
      arrayOfAbsRequires,
      filename,
      directoryPath,
    );
    arrayOfAbsRequires = arrayOfAbsRequires
      .filter((req, i) => arrayOfRelRequires[i] && !arrayOfRelRequires[i].includes('node_modules'));
    arrayOfRelRequires = arrayOfRelRequires.filter(
      req => !req.includes('node_modules'),
    );

    if (arrayOfRelRequires.length) {
      arrayOfRelRequires.forEach((element, index) => {
        const absPath = arrayOfAbsRequires[index].substring(
          9,
          arrayOfAbsRequires[index].length - 2,
        );
        data = data.replace(new RegExp(absPath), element);
      });
      fs.writeFile(filename, data, 'utf8', (error) => {
        if (error) {
          return logger.logError({
            description: `Error during ${filename} write`,
            error,
          });
        }
      });
    }
  });
}

module.exports = {
  resolveAndUpdatePaths,
};
