import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index";

import {
  getRestaurantWithAvailableItems,
} from "../../_repository/RestaurantRepository.ts";
import { RestaurantErrorMessages } from "../../_shared/_errorMessages/RestaurantErrorMessages.ts";
import { AvailableItems } from "../../_model/Item.ts";
import { RestaurantModel } from "../../_model/AddRestaurantModel.ts";

export async function getAvailableItemsHandler(
  req: Request,
  params: Record<string, string>,
): Promise<Response> {
  try {
    const restaurantId: string = params.restaurantId;

    if (!restaurantId) {
      return new Response(
        JSON.stringify({
          error: RestaurantErrorMessages.RESTAURANT_ID_REQUIRED,
        }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );
    }

    const { data, error }: {
      data: RestaurantModel | null;
      error: PostgrestError | null;
    } = await getRestaurantWithAvailableItems(parseInt(restaurantId));

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
        "Error fetching Itmes: Items not found",
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

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in getAvailableItemsHandler:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      },
    );
  }
}
