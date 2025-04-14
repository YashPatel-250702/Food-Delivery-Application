import { FoodItems } from "./FoodItemsForOrder.ts";

export interface OrderModel {
  orderId?: string;
  userId?: number;

  restaurantId: number;

  foodItems: FoodItems[];
  address: string;
  totalAmount?: number;
  orderStatus: string;
  createdAt?: Date;
  updatedAt?: Date;
}
