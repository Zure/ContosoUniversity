// T166: Validation utility functions

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate string length
 */
export const isValidLength = (value: string, min: number, max: number): boolean => {
  const length = value.trim().length;
  return length >= min && length <= max;
};

/**
 * Validate required field
 */
export const isRequired = (value: string | number | null | undefined): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

/**
 * Validate positive number
 */
export const isPositiveNumber = (value: number): boolean => {
  return !isNaN(value) && value > 0;
};

/**
 * Validate number range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return !isNaN(value) && value >= min && value <= max;
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Validate date is not in the future
 */
export const isNotFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date <= today;
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Validate course number format (positive integer)
 */
export const isValidCourseNumber = (courseNumber: number): boolean => {
  return Number.isInteger(courseNumber) && courseNumber > 0 && courseNumber <= 99999;
};

/**
 * Validate credits (0-5 range)
 */
export const isValidCredits = (credits: number): boolean => {
  return isInRange(credits, 0, 5);
};

/**
 * Validate budget (positive number)
 */
export const isValidBudget = (budget: number): boolean => {
  return isPositiveNumber(budget) && budget < 1000000000; // Max 1 billion
};
