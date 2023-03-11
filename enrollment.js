class Enrollment {
    constructor(isEnrolled) {
      this.isEnrolled = isEnrolled;
    }
  
    isUnenrolled() {
      return !this.isEnrolled;
    }
  }
  
  module.exports = Enrollment;
  