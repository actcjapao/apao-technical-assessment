/**
 * Generates a standard response object.
 * 
 * This function is used to create a consistent response format for API responses
 * or other systems that require structured feedback. It includes a status code, 
 * a message, and optional data.
 * 
 * @param {number} code - The status code or identifier representing the result of the operation.
 *                        Commonly, this would be an HTTP status code (e.g., 200, 404, etc.).
 * @param {string} message - A message providing more information about the result of the operation.
 * @param {Object} [data={}] - (Optional) Additional data related to the result. Defaults to an empty object.
 * 
 * @returns {Object} The response object containing `code`, `message`, and `data`.
 *                   Example: `{ code: 200, message: 'Success', data: { userId: 1 } }`
 */
const response = (code, message, data = {}) => {
  return { code, message, data };
};

module.exports = response;
