class Course {
    constructor(id, hasEnded) {
        this.id = id;
        this.hasEnded = hasEnded;
    }
}

class Enrollment {
    constructor(isEnrolled) {
        this.isEnrolled = isEnrolled;
    }

    isUnenrolled() {
        return !this.isEnrolled;
    }
}

class Membership {
    constructor(userId, courseId, enrollmentPromise) {
        this.userId = userId;
        this.courseId = courseId;
        this.enrollmentPromise = enrollmentPromise;
    }
}

class MyCourses {
    constructor(courses, memberships) {
        this.courses = courses;
        this.memberships = memberships;
    }

    getCourses() {
        // Filter out memberships with missing courses
        const memberships = this.memberships.filter(({ courseId }) =>
            this.courses.find(({ id }) => courseId === id)
        );

        // Get courses belonging to a membership, and their enrollments in those courses
        return Promise.all(
            memberships.map((membership) =>
                membership.enrollmentPromise.then((enrollment) => ({
                    course: this.courses.find(
                        ({ id }) => id === membership.courseId
                    ),
                    enrollment,
                }))
            )
        )
            .then((coursesEnrollments) => {
                // Filter out courses that have ended and combine with courses where user's membership is unenrolled
                const filteredCourses = coursesEnrollments
                    .filter((coursesEnrollment) => !coursesEnrollment.course.hasEnded)
                    .concat(
                        coursesEnrollments.filter((coursesEnrollment) =>
                            coursesEnrollment.enrollment.isUnenrolled()
                        )
                );
                // Sort the courses so that unenrolled courses are at the top
                const sortedCourses = filteredCourses.sort((courseA, courseB) =>
                    courseA.enrollment.isUnenrolled() &&
                    courseB.enrollment.isEnrolled
                        ? -1
                        : courseA.enrollment.isEnrolled &&
                          courseB.enrollment.isUnenrolled()
                        ? 1
                        : 0
                );

                return sortedCourses.map(({ course }) => course);
            })
            .catch((error) => {
                console.error(
                    "An error occurred while fetching membership data:",
                    error
                );
                throw error;
            });
    }
}

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


// Call the getCourses method with the sample inputs
const myCourses = new MyCourses(courses, memberships);
myCourses.getCourses().then(console.log);
