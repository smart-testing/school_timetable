const Application = require('spectron').Application;
const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiRoughly = require('chai-roughly');

const path = require('path');

before(function () {
   chai.should();
   chai.use(chaiAsPromised)
       .use(chaiRoughly);
});

let app;

async function getElectronPath () {
  let electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
  if (process.platform === 'win32') {
    electronPath += '.cmd';
  }
  return electronPath;
}

exports.setupTimeout = function (test) {
  if (process.env.CI) {
    test.timeout(30000);
  } else {
    test.timeout(10000);
  }
};

exports.startApplication = async function (options) {
  options.path = await getElectronPath();
  if (process.env.CI) {
    options.startTimeout = 30000;
  }
  let app = new Application(options);
  await app.start();
  assert.strictEqual(app.isRunning(), true);
  chaiAsPromised.transferPromiseness = app.transferPromiseness;
  return app;
};

exports.stopApplication = async function (app) {
  if (!app || !app.isRunning()) {
    return;
  }

  await app.stop();
  assert.strictEqual(app.isRunning(), false);
};

exports.initApp = function () {
  before(async function () {
    app = await exports.startApplication({ args: [path.join(__dirname, '..')] });
    return true;
  });

  after(async () => await exports.stopApplication(app));
};
