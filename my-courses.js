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
            currentCourses = courseRoles.filter(function (cr) {
                return !cr.course.hasEnded;
            });
            // Filter for courses where the user's membership is unenrolled
            unenrolledCourses = courseRoles.filter(function (cr) {
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
