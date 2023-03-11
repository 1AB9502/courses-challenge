const { courses, memberships } = require('./data');

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

// Call the getCourses method with the sample inputs
const myCourses = new MyCourses(courses, memberships);
myCourses.getCourses().then(console.log);
