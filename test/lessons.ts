exports.defaultLesson = {
  name : 'Geometry',
  room : 118,
  day : 'Tuesday',
  week : 1,
  startHours : 1,
  startMinutes : 30,
  endHours : 1,
  endMinutes : 15,
};

exports.lesson1 = {
  name : 'Math',
  room : 101,
  day : 'Monday',
  week : 1,
  startHours : 3,
  startMinutes : 30,
  endHours : 4,
  endMinutes : 15,
};

exports.getSelector = function(lesson) {
  return '.innerContainer #week' + lesson.week + ' #' + lesson.day.toLowerCase() + ' .lesson';
};
