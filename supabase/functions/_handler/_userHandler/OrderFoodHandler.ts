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
import { OrderResponse } from "../../_response/OrderResponse.ts";

export async function orderFoodsHandler(
  req: Request,
  params: Record<string, string>,
): Promise<Response> {
  try {
    const raw = await req.text();

    if (!raw) {
      return new Response(
        JSON.stringify({ error: "No data provided" }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
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
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );
    }

    if (!data) {
      console.error(
        "Error fetching restaurant: Restaurant not found",
      );
      return new Response(
        JSON.stringify({
          error: RestaurantErrorMessages.RESTAURANT_NOT_FOUND_WITH_ID,
        }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        },
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
        return new Response(
          JSON.stringify({ error: CommonErrorMessages.DATABASE_ERROR }),
          {
            status: 400,
            headers: { "content-type": "application/json" },
          },
        );
      }

      if (!data || data == null) {
        return new Response(
          JSON.stringify({
            error: RestaurantErrorMessages.NO_ITEMS_FOUND_WITH_ID,
          }),
          {
            status: 400,
            headers: { "content-type": "application/json" },
          },
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
      return new Response(
        JSON.stringify({ error: CommonErrorMessages.DATABASE_ERROR }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );
    }
    if (!insertedOrder || insertOreder == undefined) {
      console.log("Error While inserting order details:");
      return new Response(
        JSON.stringify({ error: CommonErrorMessages.DATABASE_ERROR }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({ data: insertedOrder }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in orderFoodsHandler:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
}
