class Membership {
    constructor(userId, courseId, enrollmentPromise) {
      this.userId = userId;
      this.courseId = courseId;
      this.enrollmentPromise = enrollmentPromise;
    }
  }
  
  module.exports = Membership;
  