import { User } from "../../_model/UserModel.ts";
import { validationErrorMessage } from "../../_response/Response.ts";
import { UserFieldNames } from "../_fieldNames/UserFieldNames.ts";
import { UserValidationErrorMessages } from "../_validationErrorMessages/UserValidationErrorMessages.ts";
import { HTTP_STATUS_CODE } from "../HttpCodes.ts";

/**
 * Verifies user data for required fields and validates their formats.
 *
 * @param {User} user - The user object containing fields to be validated.
 * @returns {Promise<Response> | null} - Returns a Promise with a Response containing
 * validation error messages if there are validation errors, otherwise returns null.
 */

export function UserDataValidation(
    user: User,
): Response | null {
    const errors: Record<string, string> = {};

    if (user.name) {
        if (user.name == null || user.name.length < 3) {
            errors[UserFieldNames.NAME] =
                UserValidationErrorMessages.NAME_LENGTH;
        }
    } else {
        errors[UserFieldNames.NAME] = UserValidationErrorMessages.NAME_REQUIRED;
    }

    if (user.email) {
        if (
            user.email == null || !user.email.includes("@") ||
            !user.email.endsWith(".com")
        ) {
            errors[UserFieldNames.EMAIL] =
                UserValidationErrorMessages.EMAIL_INVALID;
        }
    } else {
        errors[UserFieldNames.EMAIL] =
            UserValidationErrorMessages.EMAIL_REQUIRED;
    }

    if (user.phoneNo) {
        if (user.phoneNo == null || user.phoneNo.length !== 12) {
            errors[UserFieldNames.PHONE_NO] =
                UserValidationErrorMessages.PHONE_NO_INVALID;
        }
    } else {
        errors[UserFieldNames.PHONE_NO] =
            UserValidationErrorMessages.PHONE_NO_REQUIRED;
    }

    if (user.password) {
        if (user.password == null || user.password.length < 6) {
            errors[UserFieldNames.PASSWORD] =
                UserValidationErrorMessages.PASSWORD_LENGTH;
        }
    } else {
        errors[UserFieldNames.PASSWORD] =
            UserValidationErrorMessages.PASSWORD_REQUIRED;
    }

    if (user.address) {
        if (user.address == null || user.address.length < 6) {
            errors[UserFieldNames.ADDRESS] =
                UserValidationErrorMessages.ADDRESS_INVALID;
        }
    } else {
        errors[UserFieldNames.ADDRESS] =
            UserValidationErrorMessages.ADDRESS_REQUIRED;
    }

    if (Object.keys(errors).length > 0) {
        return validationErrorMessage(HTTP_STATUS_CODE.BAD_REQUEST, errors);
    }

    return null;
}
