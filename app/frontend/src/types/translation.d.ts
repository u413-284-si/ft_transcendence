import { Translation } from "../locales/en.js";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: Translation;
  }
}
