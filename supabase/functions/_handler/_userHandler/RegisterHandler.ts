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

/**
 * Handles user registration with validation and uniqueness check.
 */
export async function registerHandler(req: Request): Promise<Response> {
    try {
        const raw = await req.text();

        if (!raw) {
            return new Response(
                JSON.stringify({ error: CommonErrorMessages.INVALID_REQUEST }),
                {
                    status: 400,
                    headers: { "content-type": "application/json" },
                },
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
            return new Response(
                JSON.stringify({ error: CommonErrorMessages.DATABASE_ERROR }),
                {
                    status: 500,
                    headers: { "content-type": "application/json" },
                },
            );
        }

        if (emailCount && emailCount > 0) {
            return new Response(
                JSON.stringify({
                    error: UserErrorMessages.USER_ALREADY_EXISTS_WITH_EMAIL,
                }),
                {
                    status: 400,
                    headers: { "content-type": "application/json" },
                },
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
            return new Response(
                JSON.stringify({ error: CommonErrorMessages.DATABASE_ERROR }),
                {
                    status: 500,
                    headers: { "content-type": "application/json" },
                },
            );
        }

        if (phoneNoCount && phoneNoCount > 0) {
            return new Response(
                JSON.stringify({
                    error: UserErrorMessages.USER_ALREADY_EXISTS_WITH_PHONE_NO,
                }),
                {
                    status: 400,
                    headers: { "content-type": "application/json" },
                },
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
            return new Response(
                JSON.stringify({ error: CommonErrorMessages.DATABASE_ERROR }),
                {
                    status: 500,
                    headers: { "content-type": "application/json" },
                },
            );
        }

        if (!data || !data.id) {
            return new Response(
                JSON.stringify({ error: UserErrorMessages.USER_NOT_INSERTED }),
                {
                    status: 500,
                    headers: { "content-type": "application/json" },
                },
            );
        }

        return new Response(
            JSON.stringify({
                message: UserSuccessMessages.USER_REGISTERED_SUCCESSFULLY,
            }),
            {
                status: 200,
                headers: { "content-type": "application/json" },
            },
        );
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return new Response(
            JSON.stringify({
                error: CommonErrorMessages.INTERNAL_SERVER_ERROR,
            }),
            {
                status: 500,
                headers: { "content-type": "application/json" },
            },
        );
    }
}
