import { User } from "../../_model/UserModel.ts";
import { UserFieldNames } from "../_fieldNames/UserFieldNames.ts";
import { UserValidationErrorMessages } from "../_validationErrorMessages/UserValidationErrorMessages.ts";

/**
 * Verifies user data for required fields and validates their formats.
 *
 * @param {User} user - The user object containing fields to be validated.
 * @returns {Promise<Response> | null} - Returns a Promise with a Response containing
 * validation error messages if there are validation errors, otherwise returns null.
 */

export function UserDataValidation(user: User): Response | null {
    const errors: Record<string, string> = {};

    if (user.name && user.name !== null) {
        if (user.name.length < 3) {
            errors[UserFieldNames.NAME] =
                UserValidationErrorMessages.NAME_LENGTH;
        }
    } else {
        errors[UserFieldNames.NAME] = UserValidationErrorMessages.NAME_REQUIRED;
    }

    if (user.email && user.email !== null) {
        if (!user.email.includes("@") || !user.email.endsWith(".com")) {
            errors[UserFieldNames.EMAIL] =
                UserValidationErrorMessages.EMAIL_INVALID;
        }
    } else {
        errors[UserFieldNames.EMAIL] =
            UserValidationErrorMessages.EMAIL_REQUIRED;
    }

    if (user.phoneNo && user.phoneNo !== null) {
        if (user.phoneNo.length !== 12) {
            errors[UserFieldNames.PHONE_NO] =
                UserValidationErrorMessages.PHONE_NO_INVALID;
        }
    } else {
        errors[UserFieldNames.PHONE_NO] =
            UserValidationErrorMessages.PHONE_NO_REQUIRED;
    }

    if (user.password && user.password !== null) {
        if (user.password.length < 6) {
            errors[UserFieldNames.PASSWORD] =
                UserValidationErrorMessages.PASSWORD_LENGTH;
        }
    } else {
        errors[UserFieldNames.PASSWORD] =
            UserValidationErrorMessages.PASSWORD_REQUIRED;
    }

    if (user.address && user.address !== null) {
        if (user.address.length < 6) {
            errors[UserFieldNames.ADDRESS] =
                UserValidationErrorMessages.ADDRESS_INVALID;
        }
    } else {
        errors[UserFieldNames.ADDRESS] =
            UserValidationErrorMessages.ADDRESS_REQUIRED;
    }

    if (Object.keys(errors).length > 0) {
        return new Response(JSON.stringify(errors), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    return null;
}
