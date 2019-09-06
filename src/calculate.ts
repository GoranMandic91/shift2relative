import * as fs from 'fs';
import * as path from 'path';
import Logger from './logger';


export default class Calculate {
  private directoryPath: string;
  private dry: boolean;
  private logger: Logger;

  constructor(directoryPath: string, dry: boolean) {
    this.directoryPath = directoryPath;
    this.dry = dry;
    this.logger = new Logger();
  }

  private findRelativePaths(arrayOfAbsRequires, filename) {
    const arrayOfRelRequires = [];
    const requires = {};
    arrayOfAbsRequires.forEach((element, index) => {
      let elementPath = element.substring(9, element.length - 2);
      try {
        if (elementPath.includes('./')) {
          elementPath = path.resolve(filename.slice(0, filename.lastIndexOf('/')), elementPath);
        }
        const absPath = require.resolve(elementPath, { paths: [this.directoryPath] });
        let relPath = path.relative(path.dirname(filename), absPath);
        if (!relPath.includes('/') || !relPath.includes('..')) {
          relPath = `./${relPath}`;
        }
        relPath = relPath.substring(0, relPath.lastIndexOf('.'));
        arrayOfRelRequires.push(relPath);
        requires[arrayOfAbsRequires[index]] = `require('${relPath}')`;
      } catch (error) {
        this.logger.error({ description: filename, error });
      }
    });
    this.logger.info({
      [filename]: Object.keys(requires).length !== 0 ? requires : 'No changes in file',
    });
    return arrayOfRelRequires;
  }

  public resolveAndUpdatePaths(filename) {
    fs.readFile(filename, 'utf8', (error, data) => {
      if (error) {
        return this.logger.error({
          description: `Error during ${filename} read `,
          error,
        });
      }
      let arrayOfAbsRequires = data.match(/require\('(.*?)'\)/g) || [];
      arrayOfAbsRequires = arrayOfAbsRequires.filter(r => r.substring(9, r.length - 2).includes('/'));
      let arrayOfRelRequires = this.findRelativePaths(
        arrayOfAbsRequires,
        filename
      );
      arrayOfAbsRequires = arrayOfAbsRequires
        .filter((req, i) => arrayOfRelRequires[i] && !arrayOfRelRequires[i].includes('node_modules'));
      arrayOfRelRequires = arrayOfRelRequires.filter(
        req => !req.includes('node_modules'),
      );

      if (arrayOfRelRequires.length && !this.dry) {
        arrayOfRelRequires.forEach((element, index) => {
          const absPath = arrayOfAbsRequires[index].substring(
            9,
            arrayOfAbsRequires[index].length - 2,
          );
          data = data.replace(new RegExp(absPath), element);
        });
        fs.writeFile(filename, data, 'utf8', (error) => {
          if (error) {
            return this.logger.error({
              description: `Error during ${filename} write`,
              error,
            });
          }
        });
      }
    });
  }
}
