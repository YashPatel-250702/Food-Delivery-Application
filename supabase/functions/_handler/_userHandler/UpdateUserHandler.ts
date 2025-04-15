import { encodeBase64 } from "https://deno.land/x/jose@v4.14.4/runtime/base64url.ts";
import { User } from "../../_model/UserModel.ts";
import { updateUserById } from "../../_repository/UserRepository.ts";
import { ErrorResponse, SuccessResponse } from "../../_response/Response.ts";
import { CommonErrorMessages } from "../../_shared/_errorMessages/CommonErrorMessages.ts";
import { UserErrorMessages } from "../../_shared/_errorMessages/UserErrorMessages.ts";
import { UserSuccessMessages } from "../../_shared/_successMessages/UserSuccessMessage.ts";
import { UserDataValidation } from "../../_shared/_validation/UserDataValidation.ts";
import { HTTP_STATUS_CODE } from "../../_shared/HttpCodes.ts";

export async function updateUserHandler(
    req: Request,
    params: Record<string, string>,
): Promise<Response> {
    try {
        const raw: string = await req.text();

        if (!raw || raw.trim().length === 0) {
            return ErrorResponse(
                HTTP_STATUS_CODE.BAD_REQUEST,
                CommonErrorMessages.INVALID_REQUEST,
            );
        }
        const userId: string = params.id;
        const user: User = JSON.parse(raw);

        console.log("User Data is: ", user);

        const validatedUser: Response | null = UserDataValidation(user);

        if (validatedUser instanceof Response) return validatedUser;
        user.updatedAt = new Date(Date.now());
        user.id = parseInt(userId);

        if (user.password) {
            user.password = encodeBase64(user.password);
        }

        const { data, error } = await updateUserById(user);

        if (error) {
            console.error("Error updating user:", error.message);
            return ErrorResponse(
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                CommonErrorMessages.DATABASE_ERROR,
            );
        }
        if (!data) {
            return ErrorResponse(
                HTTP_STATUS_CODE.NOT_FOUND,
                UserErrorMessages.USER_NOT_FOUND + " " + userId,
            );
        }

        return SuccessResponse(
            HTTP_STATUS_CODE.OK,
            UserSuccessMessages.USER_UPDATED_SUCCESSFULLY,
        );
    } catch (error) {
        console.error("Error in updateUserHandler:", error);
        return ErrorResponse(
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            CommonErrorMessages.INTERNAL_SERVER_ERROR,
        );
    }
}
