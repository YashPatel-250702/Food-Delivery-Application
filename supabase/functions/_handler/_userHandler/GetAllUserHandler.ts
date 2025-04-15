import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index";
import { User } from "../../_model/UserModel.ts";
import { ErrorResponse, SuccessResponse } from "../../_response/Response.ts";
import { CommonErrorMessages } from "../../_shared/_errorMessages/CommonErrorMessages.ts";
import { HTTP_STATUS_CODE } from "../../_shared/HttpCodes.ts";
import { getAllUsersRepository } from "../../_repository/UserRepository.ts";
import { UserErrorMessages } from "../../_shared/_errorMessages/UserErrorMessages.ts";
import { UserSuccessMessages } from "../../_shared/_successMessages/UserSuccessMessage.ts";

export async function getAllUserHandler(
    _req: Request,
    _params: Record<string, string>,
): Promise<Response> {
    try {
        const { data, error }: {
            data: User[] | null;
            error: PostgrestError | null;
        } = await getAllUsersRepository();

        if (error) {
            console.error("Error fetching users:", error.message);
            return ErrorResponse(
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                CommonErrorMessages.DATABASE_ERROR,
            );
        }
        if (!data || data.length == 0) {
            return ErrorResponse(
                HTTP_STATUS_CODE.NOT_FOUND,
                UserErrorMessages.NO_USER_FOUND,
            );
        }

        return SuccessResponse(
            HTTP_STATUS_CODE.OK,
            UserSuccessMessages.USER_FETCHED_SUCCESSFULLY,
            data,
        );
    } catch (error) {
        console.error("Error in getAllUserHandler:", error);
        return ErrorResponse(
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            CommonErrorMessages.INTERNAL_SERVER_ERROR,
        );
    }
}
