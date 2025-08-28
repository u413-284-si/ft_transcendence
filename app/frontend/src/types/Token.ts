type TokenStatus = "valid" | "none" | "invalid" | "expired";

export type Token =
  | {
      status: "valid";
      exp: number;
    }
  | {
      status: Exclude<TokenStatus, "valid">;
    };
