import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index.js";
import { RestaurantModel } from "../../_model/AddRestaurantModel.ts";
import { CommonErrorMessages } from "../../_shared/_errorMessages/CommonErrorMessages.ts";
import { restaurantDataValidation } from "../../_shared/_validation/RestaurantDetailValidation.ts";
import {
  addRestaurantRepository,
  checkRestaurantAlreadyExists,
} from "../../_repository/RestaurantRepository.ts";
import { RegisteredType } from "../../_shared/_commonTypes.ts/InsertedType.ts";

import { RestaurantErrorMessages } from "../../_shared/_errorMessages/RestaurantErrorMessages.ts";
import { RestaurantSuccessMessages } from "../../_shared/_successMessages/RestaurantSuccessMessages.ts";
import { ErrorResponse, SuccessResponse } from "../../_response/Response.ts";
import { HTTP_STATUS_CODE } from "../../_shared/HttpCodes.ts";

export async function addRestaurantHandler(
  req: Request,
  _params: Record<string, string>,
): Promise<Response> {
  try {
    const raw = await req.text();
    if (!raw || raw.trim() === "") {
      return ErrorResponse(
        HTTP_STATUS_CODE.BAD_REQUEST,
        CommonErrorMessages.INVALID_REQUEST,
      );
    }
    const restaurantData: RestaurantModel = JSON.parse(raw);

    const validatedData: Response | null = restaurantDataValidation(
      restaurantData,
    );
    if (validatedData instanceof Response) {
      return validatedData;
    }

    const { count, error }: {
      count: number | null;
      error: PostgrestError | null;
    } = await checkRestaurantAlreadyExists(
      restaurantData.name,
      restaurantData.ownerName,
      restaurantData.ownerPhoneNo,
    );

    if (error) {
      console.error("Error checking existing restaurant:", error.message);
      return ErrorResponse(
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        CommonErrorMessages.DATABASE_ERROR,
      );
    }
    if (count && count > 0) {
      return ErrorResponse(
        HTTP_STATUS_CODE.BAD_REQUEST,
        RestaurantErrorMessages.RESTAURANT_ALREADY_EXISTS,
      );
    }

    const { data, error: insertError }: {
      data: RegisteredType | null;
      error: PostgrestError | null;
    } = await addRestaurantRepository(restaurantData);

    if (insertError) {
      console.error(
        "Error checking existing restaurant:",
        insertError.message,
      );
      return ErrorResponse(
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        CommonErrorMessages.DATABASE_ERROR,
      );
    }

    if (!data || !data.id) {
      return ErrorResponse(
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        RestaurantErrorMessages.RESTAURANT_NOT_REGISTERED,
      );
    }

    return SuccessResponse(
      HTTP_STATUS_CODE.OK,
      RestaurantSuccessMessages.RESTAURANT_REGISTERED_SUCCESSFULLY,
    );
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return ErrorResponse(
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      CommonErrorMessages.INTERNAL_SERVER_ERROR,
    );
  }
}
