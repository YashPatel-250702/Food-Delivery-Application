import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index.js";
import { User } from "../../_model/UserModel.ts";
import { UserDataValidation } from "../../_shared/_validation/UserDataValidation.ts";
import {
    checkUserAlreadyExistsByEmail,
    checkUserAlreadyExistsByPhoneNo,
    registerUserRepository,
} from "../../_repository/UserRepository.ts";
import { encodeBase64 } from "jsr:@std/encoding/base64";
import { CommonErrorMessages } from "../../_shared/_errorMessages/CommonErrorMessages.ts";
import { UserErrorMessages } from "../../_shared/_errorMessages/UserErrorMessages.ts";
import { UserSuccessMessages } from "../../_shared/_successMessages/UserSuccessMessage.ts";
import { RegisteredType } from "../../_shared/_commonTypes.ts/InsertedType.ts";
import { ErrorResponse, SuccessResponse } from "../../_response/Response.ts";
import { HTTP_STATUS_CODE } from "../../_shared/HttpCodes.ts";

/**
 * Handles user registration with validation and uniqueness check.
 */
export async function registerHandler(req: Request): Promise<Response> {
    try {
        const raw: string = await req.text();

        if (!raw || raw.trim() === "") {
            return ErrorResponse(
                HTTP_STATUS_CODE.BAD_REQUEST,
                CommonErrorMessages.INVALID_REQUEST,
            );
        }

        const user: User = JSON.parse(raw);
        const validatedUser: Response | null = UserDataValidation(user);

        if (validatedUser instanceof Response) return validatedUser;

        //checking user already present with email
        const { count: emailCount, error: existingUserErrorByMail }: {
            count: number | null;
            error: PostgrestError | null;
        } = await checkUserAlreadyExistsByEmail(user.email);

        if (existingUserErrorByMail) {
            console.error(
                "Error checking existing user:",
                existingUserErrorByMail.message,
            );
            return ErrorResponse(
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                CommonErrorMessages.DATABASE_ERROR,
            );
        }

        if (emailCount && emailCount > 0) {
            return ErrorResponse(
                HTTP_STATUS_CODE.BAD_REQUEST,
                UserErrorMessages.USER_ALREADY_EXISTS_WITH_EMAIL,
            );
        }

        //checking user already present with phoneNo
        const {
            count: phoneNoCount,
            error: exitingUserByPhoneError,
        }: {
            count: number | null;
            error: PostgrestError | null;
        } = await checkUserAlreadyExistsByPhoneNo(user.phoneNo);

        if (exitingUserByPhoneError) {
            console.error(
                "Error checking existing user:",
                exitingUserByPhoneError.message,
            );
            return ErrorResponse(
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                CommonErrorMessages.DATABASE_ERROR,
            );
        }

        if (phoneNoCount && phoneNoCount > 0) {
            return ErrorResponse(
                HTTP_STATUS_CODE.BAD_REQUEST,
                UserErrorMessages.USER_ALREADY_EXISTS_WITH_PHONE_NO,
            );
        }

        user.password = encodeBase64(user.password);

        //inserting new user record
        const {
            data,
            error,
        }: {
            data: RegisteredType | null;
            error: PostgrestError | null;
        } = await registerUserRepository(user);

        if (error) {
            console.error("Error inserting user:", error.message);
            return ErrorResponse(
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                CommonErrorMessages.DATABASE_ERROR,
            );
        }

        if (!data || !data.id) {
            return ErrorResponse(
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                UserErrorMessages.USER_NOT_INSERTED,
            );
        }
        return SuccessResponse(
            HTTP_STATUS_CODE.OK,
            UserSuccessMessages.USER_REGISTERED_SUCCESSFULLY,
        );
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return ErrorResponse(
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            CommonErrorMessages.INTERNAL_SERVER_ERROR,
        );
    }
}
