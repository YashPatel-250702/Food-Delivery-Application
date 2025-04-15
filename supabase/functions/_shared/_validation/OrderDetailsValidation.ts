import { error } from "node:console";
import { OrderModel } from "../../_model/OrderModel.ts";
import { RestaurantErrorMessages } from "../_errorMessages/RestaurantErrorMessages.ts";
import { orderFieldNames } from "../_fieldNames/OrdersFieldNames.ts";
import { RestaurantFieldNames } from "../_fieldNames/RestaurantFiledNames.ts";
import { OrderValidationMessages } from "../_validationErrorMessages/OrderValidationMessages.ts";
import { FoodItemsFieldNames } from "../_fieldNames/FoodsFieldNames.ts";
import { HTTP_STATUS_CODE } from "../HttpCodes.ts";
import { validationErrorMessage } from "../../_response/Response.ts";

export function validateOrderData(orderData: OrderModel): Response | null {
  const errors: Record<string, string> = {};

  if (!orderData.restaurantId) {
    errors[FoodItemsFieldNames.RESTAURANT_ID] =
      RestaurantErrorMessages.RESTAURANT_ID_REQUIRED;
  }

  if (orderData.foodItems) {
    if (orderData.foodItems.length >= 1) {
      for (const item of orderData.foodItems) {
        if (!item.foodId) {
          errors[FoodItemsFieldNames.FOODID] =
            OrderValidationMessages.FOOD_ITEMS_REQUIRED;
        }
        if (!item.quantity) {
          {
            errors[FoodItemsFieldNames.QUANTITY] =
              OrderValidationMessages.FOOD_ITEMS_QUANTITY_REQUIRED;
          }
        }
      }
    }
  } else {
    errors[orderFieldNames.FOOD_ITEMS] =
      OrderValidationMessages.FOOD_ITEMS_REQUIRED;
  }
  if (orderData.address) {
    if (orderData.address.length < 3) {
      errors[orderFieldNames.ADDRESS] = OrderValidationMessages.INVALID_ADDRESS;
    }
  } else {
    errors[orderFieldNames.ADDRESS] = OrderValidationMessages.ADDRESS_REQUIRED;
  }

  if (Object.keys(errors).length > 0) {
    return validationErrorMessage(HTTP_STATUS_CODE.BAD_REQUEST, errors);
  }

  return null;
}
