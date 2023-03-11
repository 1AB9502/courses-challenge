const { courses, memberships } = require("./data");

class MyCourses {
    constructor(courses, memberships) {
        this.courses = courses;
        this.memberships = memberships;
    }

    async getCourses() {
        const enrolledCourses = [];
    
        try {
            for (const membership of this.memberships) {
                const enrollment = await membership.enrollmentPromise;
                // If the user is enrolled in the course and the membership is not missing any courses,
                // find corresponding course in the "courses" array.
                if (enrollment.isEnrolled && membership.courseId !== null) {
                    const course = this.courses.find(
                        (c) => c.id === membership.courseId
                    );
                    // If the course exists and has not ended,
                    // add it to the "enrolledCourses" array.
                    if (course && !course.hasEnded) {
                        enrolledCourses.push(course);
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    
        return enrolledCourses;
    }
}    

// Call the getCourses method with the sample inputs
const myCourses = new MyCourses(courses, memberships);
myCourses.getCourses().then(console.log);
