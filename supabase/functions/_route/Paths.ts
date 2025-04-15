export enum APIPaths {
  LOGIN = "/Food-Delivery/user/login",
  REGISTER = "/Food-Delivery/user/register",

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
