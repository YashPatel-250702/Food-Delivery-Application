import { Timer } from "https://esm.sh/@types/phoenix@1.6.6/index.d.ts";
import { AvailableItems } from "./Item.ts";

export interface RestaurantModel {
    id?: number;

    name: string;

    ownerName: string;

    ownerPhoneNo: string;

    address: string;

    restaurantType: string;

    orderCapacityByDay: number;

    openTime: Timer;

    closingTime: Timer;

    AvailableItems: AvailableItems[];

    createdAt: Date;

    updatedAt: Date;
}
