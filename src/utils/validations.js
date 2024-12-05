/**
 * Validates that the required parameters are present in the given payload.
 * 
 * This function checks if all the specified parameters (in `params`) exist in the `payload` object
 * and whether they have non-empty values (i.e., not `undefined` or an empty string). If any of the 
 * required parameters are missing or empty, they are added to the `missingParameters` array.
 * 
 * @param {Array<string>} params - An array of strings representing the names of the required parameters.
 * @param {Object} payload - The object containing the data that needs to be validated.
 * @param {string|undefined} payload.<parameter> - Each key in this object represents a parameter that might be validated.
 * 
 * @returns {Array<string>} - Returns an array of the missing parameters that are either not present or have empty values.
 *                             If all parameters are valid, it returns an empty array.
 * 
 */
const validateRequiredParams = (params, payload) => {
  let missingParameters = [];
  for (const param of params) {
    if (payload?.[param] === "" || payload?.[param] === undefined) {
      missingParameters.push(param);
    }
  }
  return missingParameters;
};

/**
 * Validates if a given string is a well-formed URL.
 * 
 * This function uses a regular expression to check whether the input string matches the format
 * of a valid URL. It supports `http`, `https`, and `ftp` protocols and ensures the URL follows
 * basic URL syntax rules, such as not containing spaces or invalid characters.
 * 
 * @param {string} url - The string to be validated as a URL.
 * 
 * @returns {boolean} - Returns `true` if the `url` is valid, otherwise `false`.
 * 
 */
const isValidURL = (url) => {
  const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return regex.test(url);
};

module.exports = {
  validateRequiredParams,
  isValidURL,
};
