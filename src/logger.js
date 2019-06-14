const prettyjson = require('prettyjson');

function logInfo(data) {
  console.log(
    prettyjson.render(data, {
      keysColor: 'white',
      dashColor: 'magenta',
      stringColor: 'green',
    }),
  );
}

function logError(data) {
  console.log(
    prettyjson.render(data, {
      keysColor: 'red',
      dashColor: 'magenta',
      stringColor: 'white',
    }),
  );
}

module.exports = {
  logInfo,
  logError,
};
