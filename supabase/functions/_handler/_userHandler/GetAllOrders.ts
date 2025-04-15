import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index";
import { OrderModel } from "../../_model/OrderModel.ts";
import { getAllorders } from "../../_repository/OrdersRepository.ts";
import { CommonErrorMessages } from "../../_shared/_errorMessages/CommonErrorMessages.ts";
import { OrderErrorMessages } from "../../_shared/_errorMessages/OrderErrorMessages.ts";
import { ErrorResponse, SuccessResponse } from "../../_response/Response.ts";
import { HTTP_STATUS_CODE } from "../../_shared/HttpCodes.ts";
import { OrderSuccessMessages } from "../../_shared/_successMessages/OrderSuccessMessages.ts";

export async function getAllordersHandler(
    _req: Request,
    params: Record<string, string>,
): Promise<Response> {
    try {
        const userId = params.user_id;

        const { data, error }: {
            data: OrderModel[] | null;
            error: PostgrestError | null;
        } = await getAllorders(parseInt(userId));

        if (error) {
            console.error("Error fetching orders:", error.message);
            return ErrorResponse(
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                CommonErrorMessages.DATABASE_ERROR,
            );
        }

        if (!data || data.length == 0) {
            return ErrorResponse(
                HTTP_STATUS_CODE.NOT_FOUND,
                OrderErrorMessages.ORDER_NOT_FOUND_WITH_USER_ID + " " + userId,
            );
        }

        return SuccessResponse(
            HTTP_STATUS_CODE.OK,
            OrderSuccessMessages.ORDER_FOUND_WITH_USER_ID + " " + userId,
            data,
        );
    } catch (error) {
        console.error("Error in getAllordersHandler:", error);
        return ErrorResponse(
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            CommonErrorMessages.INTERNAL_SERVER_ERROR,
        );
    }
}
