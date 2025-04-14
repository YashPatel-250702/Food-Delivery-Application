import {
  type JWTPayload,
  jwtVerify,
  SignJWT,
} from "https://deno.land/x/jose@v4.14.4/index.ts";

const secret = new TextEncoder().encode(
  "ryweuftioovqiuhmhxwrunkfvsorniygwuiwrfamjhrycvuyikgjugbomnjupxucnskhjbuthxjabjsr",
);

export async function createJWT(payload: JWTPayload): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS512" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return jwt;
}
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
