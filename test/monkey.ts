const helpers = require('./global-setup');
const lessons = require('./lessons');
const path = require('path');

let app = null;

describe('monkey test', function () {
    helpers.initApp();
    it('run', function () {
        console.log('I am a monkey');
        return true;
    })
});