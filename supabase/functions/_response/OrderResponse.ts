import { FoodItems } from "../_model/FoodItemsForOrder.ts";

export interface OrderResponse {
  orderId: string;
  userId: number;
  restaurantId: number;
  foodItems: FoodItems[];
  address: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: Date;
}
