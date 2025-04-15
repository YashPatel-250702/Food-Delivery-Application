import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index";
import { OrderModel } from "../../_model/OrderModel.ts";
import { CommonErrorMessages } from "../../_shared/_errorMessages/CommonErrorMessages.ts";
import { OrderErrorMessages } from "../../_shared/_errorMessages/OrderErrorMessages.ts";
import {
    cancleOrderByIdRepo,
    getOrderByIdAndUserIdRepo,
} from "../../_repository/OrdersRepository.ts";
import { ErrorResponse, SuccessResponse } from "../../_response/Response.ts";
import { HTTP_STATUS_CODE } from "../../_shared/HttpCodes.ts";
import { OrderSuccessMessages } from "../../_shared/_successMessages/OrderSuccessMessages.ts";

/**
 * Cancles an order by the given order ID and user ID
 * @param req The incoming request
 * @param parms The url parameters
 * @returns A response with the updated order data, or an error message
 */
export async function cancleOrderHandler(
    req: Request,
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
        const userId = params.user_id;

        const { data, error }: {
            data: OrderModel | null;
            error: PostgrestError | null;
        } = await getOrderByIdAndUserIdRepo(
            parseInt(orderId),
            parseInt(userId),
        );

        if (error) {
            console.error("Error fetching order:", error.message);
            return ErrorResponse(
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                CommonErrorMessages.DATABASE_ERROR,
            );
        }

        if (!data) {
            return ErrorResponse(
                HTTP_STATUS_CODE.NOT_FOUND,
                OrderErrorMessages.ORDER_NOT_FOUND_WITH_ID + ": " + orderId +
                    " " + CommonErrorMessages.DATABASE_ERROR,
            );
        }

        data.orderStatus = "Cancled";
        data.updatedAt = new Date(Date.now());

        console.log("OrderId: " + orderId);
        console.log("Cancle order data", data);

        const { data: updatedOrder, error: updateError }: {
            data: OrderModel | null;
            error: PostgrestError | null;
        } = await cancleOrderByIdRepo(data, parseInt(orderId));

        if (updateError) {
            console.error(
                "Database Error while cancling order:",
                updateError.message,
            );
            return ErrorResponse(
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                CommonErrorMessages.DATABASE_ERROR,
            );
        }

        if (!updatedOrder || updatedOrder.orderStatus !== "Cancled") {
            return ErrorResponse(
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                OrderErrorMessages.ORDER_NOT_CANCLED_WITH_ID + ": " + orderId,
            );
        }
        return SuccessResponse(
            HTTP_STATUS_CODE.OK,
            OrderSuccessMessages.ORDER_CANCLED_SUCCESSFULLY + ": " + orderId,
            updatedOrder,
        );
    } catch (error) {
        console.error("Unexpected error: while cancling order", error);
        return ErrorResponse(
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            CommonErrorMessages.INTERNAL_SERVER_ERROR,
        );
    }
}
