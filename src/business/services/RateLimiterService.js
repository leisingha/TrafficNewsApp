export class RateLimiterService {
  constructor() {
    this.submissionCount = new Map(); // Map<userId, int>
    this.resetTime = new Map(); // Map<userId, DateTime>
    this.maxSubmissionsPerHour = 5;
  }

  checkLimit(userId) {
    this.cleanup(userId);
    const count = this.submissionCount.get(userId) || 0;
    return count < this.maxSubmissionsPerHour;
  }

  recordSubmission(userId) {
    this.cleanup(userId);
    const count = this.submissionCount.get(userId) || 0;
    this.submissionCount.set(userId, count + 1);

    if (!this.resetTime.has(userId)) {
      // Set reset time to 1 hour from now
      const now = new Date();
      now.setHours(now.getHours() + 1);
      this.resetTime.set(userId, now);
    }
  }

  resetLimit(userId) {
    this.submissionCount.delete(userId);
    this.resetTime.delete(userId);
  }

  getRemainingSubmissions(userId) {
    this.cleanup(userId);
    const count = this.submissionCount.get(userId) || 0;
    return Math.max(0, this.maxSubmissionsPerHour - count);
  }

  setMaxSubmissions(max) {
    this.maxSubmissionsPerHour = max;
  }

  cleanup(userId) {
    const reset = this.resetTime.get(userId);
    if (reset && new Date() > reset) {
      this.resetLimit(userId);
    }
  }
}
