import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index";
import { User } from "../../_model/UserModel.ts";
import { getUserById } from "../../_repository/UserRepository.ts";
import { ErrorResponse, SuccessResponse } from "../../_response/Response.ts";
import { CommonErrorMessages } from "../../_shared/_errorMessages/CommonErrorMessages.ts";
import { UserErrorMessages } from "../../_shared/_errorMessages/UserErrorMessages.ts";
import { HTTP_STATUS_CODE } from "../../_shared/HttpCodes.ts";
import { UserSuccessMessages } from "../../_shared/_successMessages/UserSuccessMessage.ts";

export async function getUserByIdHandler(
    _req: Request,
    params: Record<string, string>,
) {
    try {
        const userId: string = params.id;

        if (!userId) {
            return ErrorResponse(
                HTTP_STATUS_CODE.BAD_REQUEST,
                UserErrorMessages.USER_ID_REQUIRED,
            );
        }

        const id: number = parseInt(userId);

        const { data, error }: {
            data: User | null;
            error: PostgrestError | null;
        } = await getUserById(id);

        if (error) {
            console.error("Error fetching user:", error.message);
            return ErrorResponse(
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                CommonErrorMessages.DATABASE_ERROR,
            );
        }

        if (!data) {
            return ErrorResponse(
                HTTP_STATUS_CODE.NOT_FOUND,
                UserErrorMessages.USER_NOT_FOUND + userId,
            );
        }
        return SuccessResponse(
            HTTP_STATUS_CODE.OK,
            UserSuccessMessages.USER_FETCHED_SUCCESSFULLY,
            data,
        );
    } catch (error) {
        console.error("Error in getUserById:", error);
        return ErrorResponse(
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            CommonErrorMessages.INTERNAL_SERVER_ERROR,
        );
    }
}
