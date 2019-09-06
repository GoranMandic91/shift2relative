import * as prettyjson from 'prettyjson';

export default class Logger {
  private infoSetup: any;
  private errorSetup: any;

  costructor() {
    this.infoSetup = {
      keysColor: 'white',
      dashColor: 'magenta',
      stringColor: 'green',
    }
    this.errorSetup = {
      keysColor: 'red',
      dashColor: 'magenta',
      stringColor: 'white',
    }
  }
  public info(data) {
    // console.log(
    //   prettyjson.render(data, this.infoSetup),
    // );
    console.log(data);
  }
  public error(data) {
    // console.log(
    //   prettyjson.render(data, this.errorSetup),
    // );
    console.log(data);
  }
}
