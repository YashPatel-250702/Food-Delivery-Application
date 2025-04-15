import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index";
import { RestaurantModel } from "../../_model/AddRestaurantModel.ts";
import { getRestaurantByIdRepository } from "../../_repository/RestaurantRepository.ts";
import { RestaurantErrorMessages } from "../../_shared/_errorMessages/RestaurantErrorMessages.ts";
import { CommonErrorMessages } from "../../_shared/_errorMessages/CommonErrorMessages.ts";
import { ErrorResponse, SuccessResponse } from "../../_response/Response.ts";
import { HTTP_STATUS_CODE } from "../../_shared/HttpCodes.ts";
import { RestaurantSuccessMessages } from "../../_shared/_successMessages/RestaurantSuccessMessages.ts";

export async function getRestaurantByIdHandler(
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
    } = await getRestaurantByIdRepository(parseInt(restaurantId));

    if (error) {
      console.error("Error fetching restaurant:", error.message);
      if (!restaurantId) {
        return ErrorResponse(
          HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
          CommonErrorMessages.DATABASE_ERROR,
        );
      }
    }

    if (!data) {
      console.error(
        "Error fetching restaurant: Restaurant not found",
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
    console.error("Error parsing JSON:", error);
    return ErrorResponse(
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      CommonErrorMessages.DATABASE_ERROR,
    );
  }
}
