import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { set, isEmpty } from 'lodash-es';

export function isValidEmail(value: string): boolean {
  return !isEmpty(value) && isEmail(value.trim());
}

export function isValidPhone(value: string): boolean {
  return !isEmpty(value) && !isMobilePhone(value.trim());
}

export const check = (valid: boolean, field: string, errorText: string, errors: {[key: string]: string}) => {
  if (valid) {
    set(errors, field, errorText);
  } else {
    set(errors, field, "");
  }
};