export enum RestaurantValidationErrorMessages {
  NAME_REQUIRED = "Restaurant name is required",
  INVALID_NAME = "Restaurant name must be between 3 and 50 characters long",

  OWNER_NAME_REQUIRED = "Owner name is required",
  INVALID_OWNER_NAME = "Owner name must be between 3 and 50 characters long",

  OWNER_PHONE_NO_REQUIRED = "Owner phone number is required",
  INVALID_OWNER_PHONE_NO = "Owner phone number must be  10 digits long",

  ADDRESS_REQUIRED = "Address is required",
  INVALID_ADDRESS = "Address must be between 3 and 100 characters long",

  RESTAURANT_TYPE_REQUIRED = "Restaurant type is required",
  INVALID_RESTAURANT_TYPE =
    "Restaurant type must be between 3 and 50 characters long",

  ORDER_CAPACITY_REQUIRED = "Order capacity is required",
  INVALID_ORDER_CAPACITY = "Order capacity must be a number between 1 and 1000",

  OPEN_TIME_REQUIRED = "Open time is required",
  INVALID_OPEN_TIME = "Open time must be a valid time format (HH:MM)",

  CLOSING_TIME_REQUIRED = "Closing time is required",
  INVALID_CLOSING_TIME = "Closing time must be a valid time format (HH:MM)",

  AVILABLEI_ITMES_REQUIRED = "Available items are required",
  INVALID_AVAILABLE_ITEMS = "Please provide a valid list of available items",

  ITEM_NAME_REQUIRED = "Item name is required",
  INVALID_ITEM_NAME = "Item name must be between 3 and 50 characters long",
  ITEM_DESCRIPTION_REQUIRED = "Item description is required",
  INVALID_ITEM_DESCRIPTION =
    "Item description must be between 3 and 100 characters long",
  ITEM_PRICE_REQUIRED = "Item price is required",
}
