import { Program } from "@coral-xyz/anchor";
import { IDL, PrivateVesting } from "./idl";
import { Connection } from "@solana/web3.js";
export const MINT_ADDRESS = "EiGin8Xaf3uefW165oxjF23kGzaBKyoHjKNKuGpYYEXX"
export const USDT_MINT_ADDRESS = "3xpEnFCpA73fxLQJNYCHrSbaj7R38smTCfzE3eGkykBn"
export const endpoint = "https://api.devnet.solana.com"
export const connection = new Connection(endpoint, "confirmed");
export const program = new Program<PrivateVesting>(IDL, {
  connection
});
