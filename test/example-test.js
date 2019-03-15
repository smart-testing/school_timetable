// Test for examples included in README.md
const helpers = require('./global-setup');
const lessons = require('./lessons');
const path = require('path');

const describe = global.describe;
const it = global.it;
const beforeEach = global.beforeEach;
const afterEach = global.afterEach;

let app = null;

suitCaseWithAppInit = function() {
  before(function () {
    return helpers.startApplication({
      args: [path.join(__dirname, '..')]
    }).then(function (startedApp) {
      app = startedApp;
      return generateContent();
    })

  });
  after(function () {
    return removeContent().then(() => helpers.stopApplication(app));
  });
};

generateContent = function () {
  return addLesson(lessons.defaultLesson);
};

removeContent = function () {
  return removeLesson(lessons.getSelector(lessons.defaultLesson));
};

addLesson = function (options) {
  const addButton = '.addBTN';
  const lessonName = '.addLessonOverlay #lesson_name';
  const classRoom = '.addLessonOverlay #class_room';
  const day = '.addLessonOverlay #day';
  const week = '.addLessonOverlay #week';
  const startTimeHours = '.addLessonOverlay #start_time_h';
  const startTimeMinutes = '.addLessonOverlay #start_time_mm';
  const endTimeHours = '.addLessonOverlay #finish_time_h';
  const endTimeMinutes = '.addLessonOverlay #finish_time_mm';
  const add = '.addLessonOverlay .addNewLesson';

  return app.client.waitUntilWindowLoaded()
      .$(addButton).click()
      .$(lessonName).setValue(options.name)
      .$(classRoom).setValue(options.room)
      .$(day).addValue(options.day)
      .$(week).setValue(options.week)
      .$(startTimeHours).addValue(options.startHours)
      .$(startTimeMinutes).addValue(options.startMinutes)
      .$(endTimeHours).addValue(options.endHours)
      .$(endTimeMinutes).addValue(options.endMinutes)
      .$(add).click();
};

removeLesson = function (selector) {
  const delButton = '.topbar .deleteBTN';
  const delItem = selector + ' .deleteItem';

  return app.client
      .waitUntilWindowLoaded()
      .$(delButton).click()
      .$(delItem).click();
};

describe('Timetable app', function () {

  helpers.setupTimeout(this);

  describe('app initialization', function () {
    suitCaseWithAppInit();

    it('opens a window', function () {
      return app.client.waitUntilWindowLoaded()
          .browserWindow.focus()
          .getWindowCount().should.eventually.equal(1)
          .browserWindow.isMinimized().should.eventually.be.false
          .browserWindow.isDevToolsOpened().should.eventually.be.false
          .browserWindow.isVisible().should.eventually.be.true
          .browserWindow.isFocused().should.eventually.be.true
          .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
          .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0)
    })
  });

  describe('remove button', function () {
    suitCaseWithAppInit();

    const delButton = '.topbar .deleteBTN';
    const delItem = '.deleteItem';

    it('has correct state after init', function () {
      return app.client
          .waitUntilWindowLoaded()
          .$(delButton).isVisible().should.eventually.be.true;
    });

    it('should not be visible for lessons', function () {
      return app.client
          .waitUntilWindowLoaded()
          .$(delItem).isVisible().should.eventually.be.false;
    });

    it('should be visible for lessons after click on delete', function () {
      return app.client
          .waitUntilWindowLoaded()
          .$(delButton).click()
          .$(delItem).isVisible().should.eventually.be.true;
    });

    it('should not be visible for lessons after second click on delete', function () {
      return app.client
          .waitUntilWindowLoaded()
          .$(delButton).click()
          .$(delItem).isVisible().should.eventually.be.false;
    });

  });

  describe('lesson', function () {
    suitCaseWithAppInit();

    const lesson = lessons.lesson1;
    const lessonSelector = lessons.getSelector(lesson);

    it('has correct initial state', function () {
      return addLesson(lesson).then(() =>
           app.client.waitUntilWindowLoaded()
              .$(lessonSelector).isVisible().should.eventually.be.true
              .$(lessonSelector).$('#className').getText().should.eventually.equal(lesson.name)
              .$(lessonSelector).$('#classRoom').getText().should.eventually.equal(String(lesson.room))
      );
    });

    it('removes lesson correctly', function () {
      const delButton = '.topbar .deleteBTN';
      const delItem = lessonSelector + ' .deleteItem';

      return removeLesson(lessonSelector);
    });
  });

});
