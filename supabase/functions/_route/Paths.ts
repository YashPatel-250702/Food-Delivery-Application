export enum APIPaths {
  LOGIN = "/Food-Delivery/user/login",
  REGISTER = "/Food-Delivery/user/register",

  ADD_RESTAURANT = "/Food-Delivery/restaurant/add",

  GET_RESTAURANT_BY_ID = "/Food-Delivery/restaurant/get/:restaurantId",

  GET_AVAILABLE_ITEMS_BY_RESTAURANT_ID =
    "/Food-Delivery/restaurant/get/:restaurantId/items",

  ORDER_FOODS = "/Food-Delivery/user/order/food",
}
