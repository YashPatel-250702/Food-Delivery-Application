import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index";
import { RestaurantModel } from "../../_model/AddRestaurantModel.ts";
import { getAllRestaurants } from "../../_repository/RestaurantRepository.ts";
import { ErrorResponse, SuccessResponse } from "../../_response/Response.ts";
import { HTTP_STATUS_CODE } from "../../_shared/HttpCodes.ts";
import { CommonErrorMessages } from "../../_shared/_errorMessages/CommonErrorMessages.ts";
import { RestaurantErrorMessages } from "../../_shared/_errorMessages/RestaurantErrorMessages.ts";
import { RestaurantSuccessMessages } from "../../_shared/_successMessages/RestaurantSuccessMessages.ts";

/**
 * Handles a request to get all the restaurants in the database.
 *
 * @returns {Promise<Response>} A promise that resolves with an object containing the
 *    retrieved restaurants or an error if the operation fails.
 */
export async function getAllRestaurantHandler(
    _req: Request,
    _params: Record<string, string>,
): Promise<Response> {
    try {
        const { data, error }: {
            data: RestaurantModel[] | null;
            error: PostgrestError | null;
        } = await getAllRestaurants();

        if (error) {
            console.error("Error fetching restaurants:", error);
            return ErrorResponse(
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                CommonErrorMessages.DATABASE_ERROR,
            );
        }

        if (!data || data.length == 0) {
            return ErrorResponse(
                HTTP_STATUS_CODE.NOT_FOUND,
                RestaurantErrorMessages.RESTAURANT_NOT_FOUND,
            );
        }

        return SuccessResponse(
            HTTP_STATUS_CODE.OK,
            RestaurantSuccessMessages.RESTAURANT_FOUND,
            data,
        );
    } catch (error) {
        return ErrorResponse(
            HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            CommonErrorMessages.INTERNAL_SERVER_ERROR,
        );
    }
}
