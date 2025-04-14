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
import { JWTPayload } from "npm:jose@5.9.6";

export async function loginHandler(req: Request): Promise<Response> {
    try {
        const raw = await req.text();

        if (!raw) {
            return new Response(
                JSON.stringify({ error: CommonErrorMessages.INVALID_REQUEST }),
                {
                    status: 400,
                    headers: { "content-type": "application/json" },
                },
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
            return new Response(
                JSON.stringify({ error: CommonErrorMessages.DATABASE_ERROR }),
                {
                    status: 500,
                    headers: {
                        "content-type": "application/json",
                    },
                },
            );
        }
        if (data === null || data.id === undefined) {
            return new Response(
                JSON.stringify({
                    error: UserErrorMessages.USER_INVALID_CREDENTIALS,
                }),
                {
                    status: 401,
                    headers: {
                        "content-type": "application/json",
                    },
                },
            );
        }

        const jwtPayload: JWTPayload = {
            sub: "123",
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

        return new Response(JSON.stringify({ data: jwtResponse }), {
            status: 200,
            headers: {
                "content-type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error While Login:", error);
        return new Response(
            JSON.stringify({
                error: CommonErrorMessages.INTERNAL_SERVER_ERROR,
            }),
            {
                status: 500,
                headers: {
                    "content-type": "application/json",
                },
            },
        );
    }
}
