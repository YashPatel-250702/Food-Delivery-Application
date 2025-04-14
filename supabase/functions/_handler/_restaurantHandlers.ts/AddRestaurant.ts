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

export async function addRestaurantHandler(
    req: Request,
    _params: Record<string, string>,
): Promise<Response> {
    try {
        const raw = await req.text();
        if (!raw) {
            return new Response(
                JSON.stringify({ error: CommonErrorMessages.INVALID_REQUEST }),
                {
                    status: 400,
                    headers: { "content-type": "application/json" },
                },
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
            return new Response(
                JSON.stringify({ error: CommonErrorMessages.DATABASE_ERROR }),
                {
                    status: 500,
                    headers: {
                        "content-type": "application/json",
                    },
                },
            );
        }
        if (count && count > 0) {
            return new Response(
                JSON.stringify({
                    error: CommonErrorMessages.RESTAURANT_ALREADY_EXISTS,
                }),
                {
                    status: 400,
                    headers: {
                        "content-type": "application/json",
                    },
                },
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
            return new Response(
                JSON.stringify({ error: CommonErrorMessages.DATABASE_ERROR }),
                {
                    status: 500,
                    headers: {
                        "content-type": "application/json",
                    },
                },
            );
        }

        if (!data || !data.id) {
            return new Response(
                JSON.stringify({
                    error: RestaurantErrorMessages.RESTAURANT_NOT_REGISTERED,
                }),
                {
                    status: 500,
                    headers: { "content-type": "application/json" },
                },
            );
        }

        return new Response(
            JSON.stringify({
                message: RestaurantSuccessMessages.REASTAURANT_REGISTERED,
                restaurantId: data.id,
            }),
            {
                status: 200,
                headers: { "content-type": "application/json" },
            },
        );
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return new Response(
            JSON.stringify({
                error: CommonErrorMessages.INTERNAL_SERVER_ERROR,
            }),
            {
                status: 500,
                headers: {
                    "content-type": "application/json",
                },
            },
        );
    }
}
