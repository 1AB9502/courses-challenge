const Course = require('./course');
const Enrollment = require('./enrollment');
const Membership = require('./membership');

// Create courses instances
const course1 = new Course(1, false);
const course2 = new Course(2, true);
const course3 = new Course(3, false);

// Create enrollment instances
const enrollment1 = new Enrollment(true);
const enrollment2 = new Enrollment(false);

// Create student test memberships
const membership1 = new Membership(1, 1, Promise.resolve(enrollment1));
const membership2 = new Membership(1, 2, Promise.resolve(enrollment2));
const membership3 = new Membership(2, 1, Promise.resolve(enrollment1));
const membership4 = new Membership(2, 3, Promise.resolve(enrollment2));
const membership5 = new Membership(3, 2, Promise.resolve(enrollment1));
const membership6 = new Membership(3, 3, Promise.resolve(enrollment2));
// test membership with a missing course
const membership7 = new Membership(3, null, Promise.resolve(enrollment2));

const courses = [course1, course2, course3];
const memberships = [
    membership1,
    membership2,
    membership3,
    membership4,
    membership5,
    membership6,
    membership7,
];

module.exports = { courses, memberships };
