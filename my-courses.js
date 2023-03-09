const MyCourses = {
    courses: (coursesArray, membershipsArray) => {
        // There shouldn't be any memberships with missing courses
        membershipsArray = membershipsArray.filter(({ courseId }) =>
            coursesArray.find(({ id }) => courseId === id)
        );

        // Get courses belonging to a membership, and their memberships in those
        // courses
        return Promise.all(
            membershipsArray.map((membership) =>
                membership.enrollmentPromise.then((enrollment) => ({
                    course: courses.find(
                        ({ id }) => id === membership.courseId
                    ),
                    enrollment,
                }))
            )
        ).then((coursesRoles) => {
            // Filter the courses that have not ended and the user's membership is unenrolled.
            coursesRoles = coursesRoles
                .filter((courseRole) => !courseRole.course.hasEnded)
                .concat(
                    coursesRoles.filter((courseRole) =>
                        courseRole.enrollment.isUnenrolled()
                    )
                );

            // Sort the courses so that unenrolled courses are at the top
            return coursesRoles
                .sort((courseA, courseB) =>
                    courseA.enrollment.isUnenrolled() &&
                    courseB.enrollment.isEnrolled
                        ? -1
                        : courseA.enrollment.isEnrolled &&
                          courseB.enrollment.isUnenrolled()
                        ? 1
                        : 0
                )
                .map(({ course }) => course);
        });
    },
};

// Create courses instances
const course1 = new Course(1, false);
const course2 = new Course(2, true);
const course3 = new Course(3, false);

// Create enrollments instances
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

// Call the courses method with the sample inputs
MyCourses.courses(courses, memberships)
    .then(function (result) {
        console.log(result);
    })
    .catch(function (error) {
        console.error(error);
    });

// Copy over models while figuring out the imports
// Keep them at the bottom since they get hoisted
function Course(id, hasEnded) {
    this.id = id;
    this.hasEnded = hasEnded;
}

function Enrollment(isEnrolled) {
    this.isEnrolled = isEnrolled;

    this.isUnenrolled = function () {
        return !this.isEnrolled;
    };
}

function Membership(userId, courseId, enrollmentPromise) {
    this.userId = userId;
    this.courseId = courseId;
    this.enrollmentPromise = enrollmentPromise;
}
