import * as anchor from "@coral-xyz/anchor";
import { connection, program } from "../anchor/setup";
import { PublicKey } from "@solana/web3.js";
import { GlobalVars } from "../utils";
export const getVestingPDA = async () => {
    const [vestingPdaAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("vesting")],
        program.programId
    )
    const vestingPDAData = await program.account.vesting.fetch(vestingPdaAccount)
    return vestingPDAData
}
export const getUserInfoPDA = async (pubkey: PublicKey) => {
    const [userinfoPdaAccount] = await anchor.web3.PublicKey.findProgramAddressSync(
        [
            Buffer.from("user_info"),
            pubkey.toBuffer(),
        ],
        program.programId
    )
    const userinfoPdaData = await program.account.userInfo.fetch(userinfoPdaAccount)
    return userinfoPdaData
}
export async function getCurrentTimestamp() {
    const slot = await connection.getSlot('finalized');
    const blockTime = await connection.getBlockTime(slot) || 0
    GlobalVars.ts_diff = (new Date().getTime()) / 1000 - blockTime
    return blockTime
}