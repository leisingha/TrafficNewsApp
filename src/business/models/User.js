export class User {
  constructor(id, username, role) {
    this.id = id;
    this.username = username;
    this.role = role; // 'REPORTER', 'MODERATOR', 'ADMIN'
  }

  getId() {
    return this.id;
  }
  getUsername() {
    return this.username;
  }
  getRole() {
    return this.role;
  }

  isReporter() {
    return this.role === "REPORTER";
  }

  isModerator() {
    return this.role === "MODERATOR" || this.role === "ADMIN";
  }
}
