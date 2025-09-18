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
  googleId: {
    data: {
      google_oauth2_client_id: "myId"
    }
  },
  googleSecret: {
    data: {
      google_oauth2_client_secret: "secretboi"
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

  const googleId = await safeReadSecret(
    vault,
    loginResponse.client_token,
    "google_id",
    defaultSecrets.googleId
  );

  const googleSecret = await safeReadSecret(
    vault,
    loginResponse.client_token,
    "google_secret",
    defaultSecrets.googleSecret
  );

  return { jwtSecrets, googleId, googleSecret };
}

async function safeReadSecret(vault, token, key, defaultValue) {
  try {
    return await vault.readKVSecret(token, key);
  } catch (err) {
    if (err.isVaultError) {
      console.log(`Could not fetch ${key} from vault`);
      console.log(err.vaultHelpMessage);
      return defaultValue;
    }
    throw err;
  }
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
