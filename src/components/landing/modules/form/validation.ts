import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import { set, isEmpty } from "lodash-es";

export function isValidEmail(value: string): boolean {
  return !isEmpty(value) && isEmail(value.trim());
}

export function isValidPhone(value: string): boolean {
  return !isEmpty(value) && !isMobilePhone(value.trim());
}

/**
 * Validator function
 * @param {string} valid Is field valid
 * @param {string} field The name of the field
 * @param {string} errorText The error message to set if field is invalid
 * @param {string} errors The error object on which the error has to be set
 */
export const check = (
  valid: boolean,
  field: string,
  errorText: string,
  errors: { [key: string]: string }
) => {
  if (valid) {
    set(errors, field, errorText);
  } else {
    set(errors, field, "");
  }
};
