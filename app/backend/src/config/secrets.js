import fs from "fs";
import Vault from "hashi-vault-js";
import env from "./env.js";

// Default secrets (for local/dev when Vault is off)
const defaultSecrets = {
  jwtSecrets: {
    data: {
      access_token_secret: "access",
      refresh_token_secret: "refresh",
      two_fa_login_token_secret: "2fa"
    }
  },
  googleOauth2: {
    data: {
      id: "myId",
      secret: "secretboi"
    }
  }
};

async function fetchFromVault() {
  const vault = new Vault({
    https: true,
    cacert: `${env.vaultCACertDir}/root-ca.crt`,
    baseUrl: `${env.vaultAddr}/v1`,
    rootPath: "secret",
    timeout: 1000,
    proxy: false
  });

  const roleId = fs
    .readFileSync(`${env.appAuthDir}/app-role-id`, "utf8")
    .trim();
  const secretId = fs
    .readFileSync(`${env.appAuthDir}/app-secret-id`, "utf8")
    .trim();

  const status = await vault.healthCheck();
  if (status.sealed) throw new Error("Vault is sealed");

  const loginResponse = await vault.loginWithAppRole(
    roleId,
    secretId,
    "auth/approle"
  );

  const jwtSecrets = await vault.readKVSecret(
    loginResponse.client_token,
    "jwt"
  );

  let googleOauth2 = defaultSecrets.googleOauth2;
  try {
    googleOauth2 = await vault.readKVSecret(
      loginResponse.client_token,
      "google_oauth2"
    );
  } catch (err) {
    if (err.isVaultError) {
      console.log(err.vaultHelpMessage);
    } else {
      throw err;
    }
  }

  return { jwtSecrets, googleOauth2 };
}

export async function getSecrets() {
  if (env.useVault) {
    try {
      return await fetchFromVault();
    } catch (err) {
      console.error("❌ Failed to initialize Vault:", err);
      process.exit(1);
    }
  }
  return defaultSecrets;
}
