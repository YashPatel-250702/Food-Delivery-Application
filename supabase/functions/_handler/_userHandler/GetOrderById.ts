import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index";
import { OrderModel } from "../../_model/OrderModel.ts";
import { ErrorResponse, SuccessResponse } from "../../_response/Response.ts";
import { CommonErrorMessages } from "../../_shared/_errorMessages/CommonErrorMessages.ts";
import { OrderErrorMessages } from "../../_shared/_errorMessages/OrderErrorMessages.ts";
import { HTTP_STATUS_CODE } from "../../_shared/HttpCodes.ts";
import { getOrderById } from "../../_repository/OrdersRepository.ts";
import { OrderSuccessMessages } from "../../_shared/_successMessages/OrderSuccessMessages.ts";

export async function getOrderByIdHandler(
    _req: Request,
    params: Record<string, string>,
): Promise<Response> {
    try {
        const orderId = params.orderId;

        if (!orderId) {
            return ErrorResponse(
                HTTP_STATUS_CODE.BAD_REQUEST,
                OrderErrorMessages.ORDER_ID_REQUIRED,
            );
        }

        const { data, error }: {
            data: OrderModel | null;
            error: PostgrestError | null;
        } = await getOrderById(parseInt(orderId));

        if (error) {
            return ErrorResponse(
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                CommonErrorMessages.DATABASE_ERROR,
            );
        }

        if (!data) {
            return ErrorResponse(
                HTTP_STATUS_CODE.NOT_FOUND,
                OrderErrorMessages.ORDER_NOT_FOUND_WITH_ID + ": " + orderId,
            );
        }

        return SuccessResponse(
            HTTP_STATUS_CODE.OK,
            OrderSuccessMessages.ORDER_FOUND_WITH_ID + ": " + orderId,
            data,
        );
    } catch (error) {
        return ErrorResponse(
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            CommonErrorMessages.INTERNAL_SERVER_ERROR,
        );
    }
}
