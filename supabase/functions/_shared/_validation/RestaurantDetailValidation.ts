// deno-lint-ignore-file
import { RestaurantModel } from "../../_model/AddRestaurantModel.ts";
import { AvailableItemsFieldNames } from "../_fieldNames/AvailableItemsFields.ts";
import { RestaurantFieldNames } from "../_fieldNames/RestaurantFiledNames.ts";
import { RestaurantValidationErrorMessages } from "../_validationErrorMessages/RestaurantValidationErrorMessages.ts";

export function restaurantDataValidation(
  restaurantData: RestaurantModel,
): Response | null {
  const errors: Record<string, any> = {};

  if (restaurantData.name) {
    if (restaurantData.name.length < 3) {
      errors[RestaurantFieldNames.NAME] =
        RestaurantValidationErrorMessages.INVALID_NAME;
    }
  } else {
    errors[RestaurantFieldNames.NAME] =
      RestaurantValidationErrorMessages.NAME_REQUIRED;
  }

  if (restaurantData.ownerName) {
    if (restaurantData.ownerName.length < 3) {
      errors[RestaurantFieldNames.OWENER_NAME] =
        RestaurantValidationErrorMessages.INVALID_OWNER_NAME;
    }
  } else {
    errors[RestaurantFieldNames.OWENER_NAME] =
      RestaurantValidationErrorMessages.OWNER_NAME_REQUIRED;
  }

  if (restaurantData.ownerPhoneNo) {
    if (restaurantData.ownerPhoneNo.length !== 10) {
      errors[RestaurantFieldNames.OWNER_PHONE_NO] =
        RestaurantValidationErrorMessages.INVALID_OWNER_PHONE_NO;
    }
  } else {
    errors[RestaurantFieldNames.OWNER_PHONE_NO] =
      RestaurantValidationErrorMessages.OWNER_PHONE_NO_REQUIRED;
  }

  if (restaurantData.address) {
    if (
      restaurantData.address.length < 3 &&
      restaurantData.address.length > 100
    ) {
      errors[RestaurantFieldNames.ADDRESS] =
        RestaurantValidationErrorMessages.INVALID_ADDRESS;
    }
  } else {
    errors[RestaurantFieldNames.ADDRESS] =
      RestaurantValidationErrorMessages.ADDRESS_REQUIRED;
  }

  if (restaurantData.restaurantType) {
    if (
      restaurantData.restaurantType.length < 3 &&
      restaurantData.restaurantType.length > 50
    ) {
      errors[RestaurantFieldNames.RESTAURANT_TYPE] =
        RestaurantValidationErrorMessages.INVALID_RESTAURANT_TYPE;
    }
  } else {
    errors[RestaurantFieldNames.RESTAURANT_TYPE] =
      RestaurantValidationErrorMessages.RESTAURANT_TYPE_REQUIRED;
  }

  if (restaurantData.orderCapacityByDay) {
    if (
      restaurantData.orderCapacityByDay < 1 &&
      restaurantData.orderCapacityByDay > 1000
    ) {
      errors[RestaurantFieldNames.ORDER_CAPACITY] =
        RestaurantValidationErrorMessages.INVALID_ORDER_CAPACITY;
    }
  } else {
    errors[RestaurantFieldNames.ORDER_CAPACITY] =
      RestaurantValidationErrorMessages.ORDER_CAPACITY_REQUIRED;
  }

  if (!restaurantData.openTime) {
    errors[RestaurantFieldNames.OPEN_TIME] =
      RestaurantValidationErrorMessages.OPEN_TIME_REQUIRED;
  }

  if (!restaurantData.closingTime) {
    errors[RestaurantFieldNames.CLOSING_TIME] =
      RestaurantValidationErrorMessages.CLOSING_TIME_REQUIRED;
  }

  if (restaurantData.AvailableItems) {
    if (restaurantData.AvailableItems.length < 1) {
      errors[RestaurantFieldNames.AVAILABLEITMES] =
        RestaurantValidationErrorMessages.INVALID_AVAILABLE_ITEMS;
    } else {
      const itemErrors: Record<string, string> = {};

      for (const item of restaurantData.AvailableItems) {
        if (item.name) {
          if (item.name.length < 3) {
            itemErrors[AvailableItemsFieldNames.NAME] =
              RestaurantValidationErrorMessages.INVALID_ITEM_NAME;
          }
        } else {
          itemErrors[AvailableItemsFieldNames.NAME] =
            RestaurantValidationErrorMessages.ITEM_NAME_REQUIRED;
        }

        if (item.description) {
          if (
            item.description.length < 3 &&
            item.description.length > 100
          ) {
            itemErrors[AvailableItemsFieldNames.DESCRIPTION] =
              RestaurantValidationErrorMessages
                .INVALID_ITEM_DESCRIPTION;
          }
        } else {
          itemErrors[AvailableItemsFieldNames.DESCRIPTION] =
            RestaurantValidationErrorMessages
              .ITEM_DESCRIPTION_REQUIRED;
        }

        if (item.price) {
          if (item.price < 1) {
            itemErrors[AvailableItemsFieldNames.PRICE] =
              RestaurantValidationErrorMessages
                .ITEM_PRICE_REQUIRED;
          }
        } else {
          itemErrors[AvailableItemsFieldNames.PRICE] =
            RestaurantValidationErrorMessages.ITEM_PRICE_REQUIRED;
        }

        if (Object.keys(itemErrors).length > 0) {
          errors[RestaurantFieldNames.AVAILABLEITMES] = itemErrors;
        }
      }
    }
  } else {
    errors[RestaurantFieldNames.AVAILABLEITMES] =
      RestaurantValidationErrorMessages.AVILABLEI_ITMES_REQUIRED;
  }

  if (Object.keys(errors).length > 0) {
    return new Response(JSON.stringify(errors), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return null;
}
