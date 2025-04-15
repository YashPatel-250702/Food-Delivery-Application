import { UserLogin } from "../../_model/UserLogin.ts";
import { validationErrorMessage } from "../../_response/Response.ts";
import { UserFieldNames } from "../_fieldNames/UserFieldNames.ts";
import { UserValidationErrorMessages } from "../_validationErrorMessages/UserValidationErrorMessages.ts";
import { HTTP_STATUS_CODE } from "../HttpCodes.ts";

export function validateUserLoginData(usrLogin: UserLogin): Response | null {
    const errors: Record<string, string> = {};

    if (usrLogin.email) {
        if (
            usrLogin.email == null || !usrLogin.email.includes("@") ||
            !usrLogin.email.endsWith(".com")
        ) {
            errors[UserFieldNames.EMAIL] =
                UserValidationErrorMessages.EMAIL_INVALID;
        }
    } else {
        errors[UserFieldNames.EMAIL] =
            UserValidationErrorMessages.EMAIL_REQUIRED;
    }

    if (usrLogin.password) {
        if (usrLogin.password == null || usrLogin.password.length < 6) {
            errors[UserFieldNames.PASSWORD] =
                UserValidationErrorMessages.PASSWORD_LENGTH;
        }
    } else {
        errors[UserFieldNames.PASSWORD] =
            UserValidationErrorMessages.PASSWORD_REQUIRED;
    }

    if (Object.keys(errors).length > 0) {
        return validationErrorMessage(HTTP_STATUS_CODE.BAD_REQUEST, errors);
    }
    return null;
}
