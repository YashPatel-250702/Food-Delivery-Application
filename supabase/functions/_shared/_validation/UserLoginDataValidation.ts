import { UserLogin } from "../../_model/UserLogin.ts";
import { UserFieldNames } from "../_fieldNames/UserFieldNames.ts";
import { UserValidationErrorMessages } from "../_validationErrorMessages/UserValidationErrorMessages.ts";

export function validateUserLoginData(usrLogin:UserLogin ):  Response|null {

    const errors: Record<string, string> = {};

    if (usrLogin.email&&usrLogin.email!==null) {
        if (!usrLogin.email.includes("@") || !usrLogin.email.endsWith(".com")) {
            errors[UserFieldNames.EMAIL] = UserValidationErrorMessages.EMAIL_INVALID;
        }
    } else {
        errors[UserFieldNames.EMAIL] = UserValidationErrorMessages.EMAIL_REQUIRED;
    }

    if (usrLogin.password&&usrLogin.password!==null) {
        if (usrLogin.password.length < 6) {
            errors[UserFieldNames.PASSWORD] = UserValidationErrorMessages.PASSWORD_LENGTH;
        }
    } else {
        errors[UserFieldNames.PASSWORD] = UserValidationErrorMessages.PASSWORD_REQUIRED;
    }

    if (Object.keys(errors).length > 0) {
        return new Response(JSON.stringify(errors), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    return null;

}
    