export class ValidationResult {
  constructor(isValid, errors = [], fieldErrors = {}) {
    this.isValid = isValid;
    this.errors = errors; // List<String> (General errors)
    this.fieldErrors = fieldErrors; // Map<String, String> (Field-specific errors)
  }

  isValidResult() {
    return this.isValid;
  }
  getErrors() {
    return this.errors;
  }
  getFieldErrors() {
    return this.fieldErrors;
  }

  addError(error) {
    this.errors.push(error);
    this.isValid = false;
  }

  addFieldError(field, error) {
    this.fieldErrors[field] = error;
    this.isValid = false;
  }
}
