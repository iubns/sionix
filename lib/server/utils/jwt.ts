import jwt from "jsonwebtoken";

export interface TokenPayload {
  userId: string;
  email: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요.",
    );
  }
  return secret;
}

export function generateAccessToken(payload: TokenPayload): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, {
    expiresIn: "1d",
    algorithm: "HS256",
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
}

export function verifyToken(token: string): TokenPayload {
  const secret = getJwtSecret();
  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });
    return decoded as TokenPayload;
  } catch (error) {
    throw new Error("토큰 검증에 실패했습니다.");
  }
}
