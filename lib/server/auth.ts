import "server-only";
import { betterAuth } from "better-auth";
import { database } from "./database";

export const auth = betterAuth({
  appName: "hachimi.tv",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database,
  emailAndPassword: { enabled: true },
});
