#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const recursive = require("recursive-readdir");

const args = process.argv;
const directoryPath = process.cwd() + args[2];

function ignoreFile(file, stats) {
  return path.extname(file) !== "" && path.extname(file) !== ".js";
}

function calculateRelativePaths(arrayOfAbsRequires, filename) {
  const arrayOfRelRequires = [];
  arrayOfAbsRequires.forEach((element, index) => {
    const elementPath = element.substring(9, element.length - 2);
    try {
      const absPath = require.resolve(elementPath, { paths: [directoryPath] });
      let relPath = path.relative(path.dirname(filename), absPath);
      if (!relPath.includes("/") || !relPath.includes("..")) {
        relPath = `./${relPath}`;
      }
      relPath = relPath.substring(0, relPath.lastIndexOf("."));
      arrayOfRelRequires.push(relPath);
    } catch (error) {
      console.log("Filename: ", filename, "\nError:", error);
    }
  });
  return arrayOfRelRequires;
}

function updateFile(filename) {
  fs.readFile(filename, "utf8", function(err, data) {
    if (err) return console.log(`Error during ${filename} read: `, err);

    let arrayOfAbsRequires = data.match(/require\('(.*?)'\)/g) || [];
    arrayOfAbsRequires = arrayOfAbsRequires.filter(r =>
      r.substring(9, r.length - 2).includes("/")
    );
    let arrayOfRelRequires = calculateRelativePaths(
      arrayOfAbsRequires,
      filename
    );
    arrayOfAbsRequires = arrayOfAbsRequires.filter(
      (req, i) =>
        arrayOfRelRequires[i] && !arrayOfRelRequires[i].includes("node_modules")
    );
    arrayOfRelRequires = arrayOfRelRequires.filter(
      req => !req.includes("node_modules")
    );

    if (arrayOfRelRequires.length) {
      arrayOfRelRequires.forEach((element, index) => {
        const absPath = arrayOfAbsRequires[index].substring(
          9,
          arrayOfAbsRequires[index].length - 2
        );
        data = data.replace(new RegExp(absPath), element);
      });
      fs.writeFile(filename, data, "utf8", function(err) {
        if (err) return console.log(`Error during ${filename} write: `, err);
      });
    }
  });
}

recursive(directoryPath, [ignoreFile])
  .then(files => {
    console.log("Number of files: ", files.length);
    files.forEach(filename => {
      updateFile(filename);
    });
  })
  .catch(err => {
    return console.log("Unable to scan directory: " + err);
  });
