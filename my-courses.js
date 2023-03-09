// Copy over models while figuring out the imports
function Course(id, hasEnded) {
    this.id = id;
    this.hasEnded = hasEnded;
}

function Enrollment(isEnrolled) {
    this.isEnrolled = isEnrolled;

    this.isUnenrolled = function() {
        return !this.isEnrolled;
    }
}

function Membership(userId, courseId, enrollmentPromise) {
    this.userId = userId;
    this.courseId = courseId;
    this.enrollmentPromise = enrollmentPromise;
}

// Create courses instances
const course1 = new Course(1, false);
const course2 = new Course(2, true);
const course3 = new Course(3, false);

// Create enrollments instances
const enrollment1 = new Enrollment(true);
const enrollment2 = new Enrollment(false);

// Create test memberships
const membership1 = new Membership(1, 1, Promise.resolve(enrollment1));
const membership2 = new Membership(1, 2, Promise.resolve(enrollment2));
const membership3 = new Membership(2, 1, Promise.resolve(enrollment1));
const membership4 = new Membership(2, 2, Promise.resolve(enrollment2));
const membership5 = new Membership(3, 3, Promise.resolve(enrollment1));
const membership6 = new Membership(3, 3, Promise.resolve(enrollment2));

const courses = [course1, course2, course3];
const memberships = [membership1, membership2, membership3, membership4, membership5, membership6];

var MyCourses = {
    courses: function (cs, ms) {
        // There shouldn't be any memberships with missing courses, but just in
        // case
        ms = ms.filter(function (membership) {
            var matchingCourse = cs.find(function (course) {
                return membership.courseId === course.id;
            });
            return matchingCourse !== undefined;
        });
        // Get courses belonging to a membership, and their memberships in those
        // courses
        return Promise.all(
                // Get the enrollment, and map it to the associated course
                ms.map(function (membership) {
                    return membership.enrollmentPromise.then(function (enrollment) {
                        return ({
                            course: courses.find(function (course) {
                                    return membership.courseId === course.id;
                                }),
                            enrollment: enrollment
                        });
                });
        })).then(function (coursesRoles) {
            // Filter the courses to current courses
            currentCourses = coursesRoles.filter(function (cr) {
                return !cr.course.hasEnded;
            });
            // Filter for courses where the user's membership is unenrolled
            unenrolledCourses = coursesRoles.filter(function (cr) {
                return cr.enrollment.isUnenrolled();
            });

            // Merge the two
            coursesRoles = currentCourses.concat(unenrolledCourses);

            // Sort the courses so that unenrolled courses are at the top
            return coursesRoles.sort(function (courseA, courseB) {
                // If A is unenrolled, but B is not, sort A higher
                if (courseA.enrollment.isUnenrolled() &&
                    !courseB.enrollment.isUnenrolled()) {
                        return -1;
                }
                // If B is unenrolled, but A is not, sort B higher
                if (!courseA.enrollment.isUnenrolled() &&
                    courseB.enrollment.isUnenrolled()) {
                        return 1;
                }
                // Otherwise don't sort
                return 0;
            }).map(function (cr) {
                // Return the course
                return cr.course;
            });
        });
    }
};

// Call the courses method with the sample inputs
MyCourses.courses(courses, memberships).then(function (result) {
  console.log(result);
}).catch(function (error) {
  console.error(error);
});
