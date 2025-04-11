import { HttpMethods } from './shared/HttpMethods';
import { APIPaths } from './Paths.ts';
import { sendOtpHandler } from '../_handler/SendOtpHandler.ts';
import { verifyOtpHandler } from '../_handler/VerifyOtpHandler.ts';

export const FoodDeliveryRoutes = {
  [HttpMethods.POST]: {
    [APIPaths.SENDOTP]: sendOtpHandler,
    [APIPaths.VERIFYOTP]: verifyOtpHandler,
  },
};
