import dotenv from "dotenv";
dotenv.config();

import type { StringValue } from "../types/common";

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY as StringValue;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY as StringValue;
