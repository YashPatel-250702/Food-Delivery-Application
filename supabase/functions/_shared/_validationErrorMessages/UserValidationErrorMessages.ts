
export const enum UserValidationErrorMessages {

  NAME_REQUIRED = 'Username is required',
  NAME_LENGTH = 'Username should be at least 3 characters long',
  
  PASSWORD_REQUIRED = 'Password is required',
  PASSWORD_LENGTH = 'Password should be at least 6 characters long',
  
  EMAIL_REQUIRED = 'Email is required',
  EMAIL_INVALID = 'Email is invalid Must contain @ and ends with ".com"',

  PHONE_NO_REQUIRED = 'Phone number is required',
  PHONE_NO_INVALID = 'Phone number should start with +91 and at least 10 digits long',

  ADDRESS_REQUIRED = 'Address is required',
  ADDRESS_INVALID = 'Address should be at least 6 characters long',
}
