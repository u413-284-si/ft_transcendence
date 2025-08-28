type TokenStatus = "valid" | "none" | "invalid" | "expired";
type TokenType = "access" | "refresh";

export type Token =
  | {
      status: "valid";
      type: TokenType;
      exp: number;
    }
  | {
      status: Exclude<TokenStatus, "valid">;
    };

export type ValidToken = Extract<Token, { status: "valid" }>;
