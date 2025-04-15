import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index";

import {
  getRestaurantWithAvailableItems,
} from "../../_repository/RestaurantRepository.ts";
import { RestaurantErrorMessages } from "../../_shared/_errorMessages/RestaurantErrorMessages.ts";
import { RestaurantModel } from "../../_model/AddRestaurantModel.ts";
import { ErrorResponse, SuccessResponse } from "../../_response/Response.ts";
import { HTTP_STATUS_CODE } from "../../_shared/HttpCodes.ts";
import { CommonErrorMessages } from "../../_shared/_errorMessages/CommonErrorMessages.ts";
import { RestaurantSuccessMessages } from "../../_shared/_successMessages/RestaurantSuccessMessages.ts";

export async function getAvailableItemsHandler(
  _req: Request,
  params: Record<string, string>,
): Promise<Response> {
  try {
    const restaurantId: string = params.restaurantId;

    if (!restaurantId) {
      return ErrorResponse(
        HTTP_STATUS_CODE.BAD_REQUEST,
        RestaurantErrorMessages.RESTAURANT_ID_REQUIRED,
      );
    }

    const { data, error }: {
      data: RestaurantModel | null;
      error: PostgrestError | null;
    } = await getRestaurantWithAvailableItems(parseInt(restaurantId));

    if (error) {
      console.error("Error fetching restaurant:", error.message);
      return ErrorResponse(
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        CommonErrorMessages.DATABASE_ERROR,
      );
    }

    if (!data) {
      console.error(
        "Error fetching Itmes: Items not found",
      );
      return ErrorResponse(
        HTTP_STATUS_CODE.NOT_FOUND,
        RestaurantErrorMessages.RESTAURANT_NOT_FOUND_WITH_ID + " " +
          restaurantId,
      );
    }

    return SuccessResponse(
      HTTP_STATUS_CODE.OK,
      RestaurantSuccessMessages.RESTAURANT_FOUND_WITH_ID + " " + restaurantId,
      data,
    );
  } catch (error) {
    console.error("Error in getAvailableItemsHandler:", error);
    return ErrorResponse(
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      CommonErrorMessages.INTERNAL_SERVER_ERROR,
    );
  }
}
