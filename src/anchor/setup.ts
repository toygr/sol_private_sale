import { Program } from "@coral-xyz/anchor";
import { IDL, PrivateVesting } from "./idl";
import { Connection } from "@solana/web3.js";
export const endpoint = "https://mainnet.helius-rpc.com/?api-key=5272d7ee-b226-41e1-9c7b-1a28d7271db0"
export const connection = new Connection(endpoint, "confirmed");
export const program = new Program<PrivateVesting>(IDL, {
  connection
});
