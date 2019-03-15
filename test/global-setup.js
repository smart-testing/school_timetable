const Application = require('spectron').Application;
const assert = require('assert');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiRoughly = require('chai-roughly');

const path = require('path');

global.before(function () {
  chai.should();
  chai.use(chaiAsPromised);
  chai.use(chaiRoughly)
});

exports.getElectronPath = function () {
  var electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
  if (process.platform === 'win32') electronPath += '.cmd';
  return electronPath
};

exports.setupTimeout = function (test) {
  if (process.env.CI) {
    test.timeout(30000)
  } else {
    test.timeout(10000)
  }
};

exports.startApplication = function (options) {
  options.path = exports.getElectronPath();
  if (process.env.CI) options.startTimeout = 30000;

  var app = new Application(options);
  return app.start().then(function () {
    assert.strictEqual(app.isRunning(), true);
    chaiAsPromised.transferPromiseness = app.transferPromiseness;
    return app
  })
};

exports.stopApplication = function (app) {
  if (!app || !app.isRunning()) return;

  return app.stop().then(function () {
    assert.strictEqual(app.isRunning(), false)
  })
};

exports.suitCaseWithAppInit = function(app) {
  before(function () {
    return startApplication({
      args: [path.join(__dirname, '..')]
    }).then(function (startedApp) { app = startedApp })
  });

  after(function () {
    return stopApplication(app)
  });
};
