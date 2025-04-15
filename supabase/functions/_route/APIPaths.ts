export enum APIPaths {
    LOGIN = "/Food-Delivery/user/login",
    REGISTER = "/Food-Delivery/user/register",

    GET_USER_BY_ID = "/Food-Delivery/user/get/:id",

    GET_ALL_USERS = "/Food-Delivery/user/getAll",
    UPDATE_USER = "/Food-Delivery/user/update/:id",

    ADD_RESTAURANT = "/Food-Delivery/restaurant/add",

    GET_ALL_RESTAURANTS = "/Food-Delivery/restaurant/getAll",
    GET_RESTAURANT_BY_ID = "/Food-Delivery/restaurant/get/:restaurantId",

    GET_AVAILABLE_ITEMS_BY_RESTAURANT_ID =
        "/Food-Delivery/restaurant/get/:restaurantId/items",

    ORDER_FOODS = "/Food-Delivery/order/food",

    GET_ORDER_BYID = "/Food-Delivery/order/get/:orderId",

    CANCLE_ORDER = "/Food-Delivery/order/cancle/:orderId",

    GTE_ALL_ORDERS_BY_USER_ID = "/Food-Delivery/order/getAllOrders",
}
