import { encodeBase64 } from "jsr:@std/encoding/base64";
import { CommonErrorMessages } from "../../_shared/_errorMessages/CommonErrorMessages.ts";
import { UserLogin } from "../../_model/UserLogin.ts";
import { validateUserLoginData } from "../../_shared/_validation/UserLoginDataValidation.ts";
import { userLoginRepository } from "../../_repository/UserRepository.ts";
import { User } from "../../_model/UserModel.ts";
import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index";
import { UserErrorMessages } from "../../_shared/_errorMessages/UserErrorMessages.ts";
import { createJWT } from "../../_utils/JwtUtil.ts";
import { UserSuccessMessages } from "../../_shared/_successMessages/UserSuccessMessage.ts";
import { JwtResponse } from "../../_response/JwtResponse.ts";
import { JWTPayload } from "https://deno.land/x/jose@v4.14.4/index.ts";
import { ErrorResponse, SuccessResponse } from "../../_response/Response.ts";
import { HTTP_STATUS_CODE } from "../../_shared/HttpCodes.ts";

export async function loginHandler(req: Request): Promise<Response> {
  try {
    const raw: string = await req.text();

    if (!raw || raw.trim() === "") {
      return ErrorResponse(
        HTTP_STATUS_CODE.BAD_REQUEST,
        CommonErrorMessages.INVALID_REQUEST,
      );
    }

    const userLogin: UserLogin = await JSON.parse(raw);
    const validatedData: Response | null = validateUserLoginData(userLogin);

    if (validatedData instanceof Response) {
      return validatedData;
    }
    const encodedPassword: string = encodeBase64(userLogin.password);
    userLogin.password = encodedPassword;

    const { data, error }: {
      data: User | null;
      error: PostgrestError | null;
    } = await userLoginRepository(userLogin);

    if (error) {
      console.error("Error checking existing user:", error.message);
      return ErrorResponse(
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
        CommonErrorMessages.DATABASE_ERROR,
      );
    }
    if (!data || data === null || data.id === undefined) {
      return ErrorResponse(
        HTTP_STATUS_CODE.NOT_FOUND,
        UserErrorMessages.USER_INVALID_CREDENTIALS,
      );
    }

    const jwtPayload: JWTPayload = {
      sub: data.id.toString(),
      userRole: data.userRole,
    };

    const jwtToken: string = await createJWT(jwtPayload);
    const jwtResponse: JwtResponse = {
      id: data.id,
      message: UserSuccessMessages.USER_LOGIN_SUCCESSFULLY,
      token: jwtToken,
      issuedAt: new Date(),
      expiredAt: new Date(Date.now() + 60 * 60 * 1000),
    };

    return SuccessResponse(
      HTTP_STATUS_CODE.OK,
      UserSuccessMessages.USER_LOGIN_SUCCESSFULLY,
      jwtResponse,
    );
  } catch (error) {
    console.error("Error While Login:", error);
    return ErrorResponse(
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      CommonErrorMessages.INTERNAL_SERVER_ERROR,
    );
  }
}
