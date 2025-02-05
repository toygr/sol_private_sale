import { Program } from "@coral-xyz/anchor";
import { IDL, PrivateVesting } from "./idl";
import { Connection } from "@solana/web3.js";
export const endpoint = "https://api.devnet.solana.com"
export const connection = new Connection(endpoint, "confirmed");
export const program = new Program<PrivateVesting>(IDL, {
  connection
});
