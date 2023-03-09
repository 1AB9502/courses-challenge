function Enrollment(isEnrolled) {
    this.isEnrolled = isEnrolled;

    isUnenrolled = function() {
        return !this.isEnrolled;
    }
}
