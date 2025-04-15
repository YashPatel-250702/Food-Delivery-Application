import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index";
import { RestaurantModel } from "../../_model/AddRestaurantModel.ts";
import { OrderModel } from "../../_model/OrderModel.ts";
import { getRestaurantByIdRepository } from "../../_repository/RestaurantRepository.ts";
import { validateOrderData } from "../../_shared/_validation/OrderDetailsValidation.ts";
import { RestaurantErrorMessages } from "../../_shared/_errorMessages/RestaurantErrorMessages.ts";
import { getAvailableItemsById } from "../../_repository/AvailableItemsRepo.ts";
import { AvailableItems } from "../../_model/Item.ts";
import { CommonErrorMessages } from "../../_shared/_errorMessages/CommonErrorMessages.ts";
import { insertOreder } from "../../_repository/OrdersRepository.ts";
import { ErrorResponse, SuccessResponse } from "../../_response/Response.ts";
import { HTTP_STATUS_CODE } from "../../_shared/HttpCodes.ts";
import { OrderErrorMessages } from "../../_shared/_errorMessages/OrderErrorMessages.ts";
import { OrderSuccessMessages } from "../../_shared/_successMessages/OrderSuccessMessages.ts";

export async function orderFoodsHandler(
  req: Request,
  params: Record<string, string>,
): Promise<Response> {
  try {
    const raw: string = await req.text();

    if (!raw || raw.trim() === "") {
      return ErrorResponse(
        HTTP_STATUS_CODE.BAD_REQUEST,
        CommonErrorMessages.INVALID_REQUEST,
      );
    }

    const orderData: OrderModel = JSON.parse(raw);

    const validatedOrderData: Response | null = validateOrderData(orderData);

    if (validatedOrderData instanceof Response) {
      return validatedOrderData;
    }

    const { data, error }: {
      data: RestaurantModel | null;
      error: PostgrestError | null;
    } = await getRestaurantByIdRepository(orderData.restaurantId);

    if (error) {
      console.error("Error fetching restaurant:", error.message);
      return ErrorResponse(
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        CommonErrorMessages.DATABASE_ERROR,
      );
    }

    if (!data) {
      console.error(
        "Error fetching restaurant: Restaurant not found",
      );
      return ErrorResponse(
        HTTP_STATUS_CODE.NOT_FOUND,
        RestaurantErrorMessages.RESTAURANT_NOT_FOUND_WITH_ID + ": " +
          orderData.restaurantId,
      );
    }

    let totalAmount = 0;
    for (const item of orderData.foodItems) {
      const { data, error }: {
        data: AvailableItems | null;
        error: PostgrestError | null;
      } = await getAvailableItemsById(item.foodId);

      if (error) {
        console.error("Error fetching Items Details:", error.message);
        return ErrorResponse(
          HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          CommonErrorMessages.DATABASE_ERROR,
        );
      }

      if (!data || data == null) {
        return ErrorResponse(
          HTTP_STATUS_CODE.NOT_FOUND,
          RestaurantErrorMessages.NO_ITEMS_FOUND_WITH_ID + ": " + item.foodId,
        );
      }

      totalAmount += data.price * item.quantity;
    }

    const userId: string = params.user_id;
    orderData.userId = parseInt(userId);
    orderData.totalAmount = totalAmount;
    orderData.orderStatus = "Accepted";

    console.log("userId: ", userId);

    const { data: insertedOrder, error: insertedOrderError }: {
      data: OrderModel | null;
      error: PostgrestError | null;
    } = await insertOreder(orderData);

    if (insertedOrderError) {
      console.log("Error inserting order: ", insertedOrderError.message);
      return ErrorResponse(
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        CommonErrorMessages.DATABASE_ERROR,
      );
    }
    if (!insertedOrder || insertOreder == undefined) {
      console.log("Error While inserting order details:");

      return ErrorResponse(
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        OrderErrorMessages.ORDER_NOT_CREATED,
      );
    }

    return SuccessResponse(
      HTTP_STATUS_CODE.OK,
      OrderSuccessMessages.ORDER_CREATED_SUCCESSFULLY,
      insertedOrder,
    );
  } catch (error) {
    console.error("Error in orderFoodsHandler:", error);
    return ErrorResponse(
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      CommonErrorMessages.INTERNAL_SERVER_ERROR,
    );
  }
}
