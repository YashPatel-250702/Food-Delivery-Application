export enum OrderErrorMessages {
    ORDER_ID_REQUIRED = "Order ID is required",
    ORDER_NOT_FOUND_WITH_ID =
        "Any Active Order not found for current user with order ID : ",
    ORDER_NOT_FOUND_WITH_USER_ID = "Order not found with this User ID: ",
    ORDER_NOT_FOUND_WITH_RESTAURANT_ID =
        "Order not found with this Restaurant ID: ",
    ORDER_NOT_FOUND_WITH_FOOD_ID = "Order not found with this Food ID: ",

    ORDER_NOT_CANCLED_WITH_ID = "Order not cancelled with this ID: ",

    ORDER_NOT_CREATED = "Error while creating order, please try again later",
}
