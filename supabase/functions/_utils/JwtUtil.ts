import {
  type JWTPayload,
  jwtVerify,
  SignJWT,
} from "https://deno.land/x/jose@v4.14.4/index.ts";

const secret = new TextEncoder().encode(
  "ryweuftioovqiuhmhxwrunkfvsorniygwuiwrfamjhrycvuyikgjugbomnjupxucnskhjbuthxjabjsr",
);

/**
 * Creates a JSON Web Token (JWT) based on the provided payload.
 *
 * This function generates a JWT with the HS512 algorithm and sets the token's
 * issued at time to the current time. The token will expire in 1 hour.
 *
 * @param payload - The JWT payload containing the claims.
 * @returns A promise that resolves to a signed JWT string.
 */

export async function createJWT(payload: JWTPayload): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS512" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return jwt;
}
/**
 * Verifies the given JWT token and returns the payload if the token is valid.
 *
 * This function verifies the given JWT token with the secret key and returns
 * the payload if the token is valid. If the token is invalid, it returns null.
 *
 * @param token - The JWT token to verify.
 * @returns A promise that resolves to the JWT payload or null if the token is invalid.
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    console.log("JWT is valid:", payload);
    return payload;
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
}
