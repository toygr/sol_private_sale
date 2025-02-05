import * as anchor from "@coral-xyz/anchor";
import { connection, program } from "../anchor/setup";
import { PublicKey } from "@solana/web3.js";
import { GlobalVars } from "../utils";
import { promiseToast } from "../utils/toast";
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
export const processTxInToast = async (tx: anchor.web3.Transaction, sendTransaction: (transaction: anchor.web3.Transaction | anchor.web3.VersionedTransaction, connection: anchor.web3.Connection, options?: any) => Promise<anchor.web3.TransactionSignature>, callback: () => void, resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
    try {
        const signature = await sendTransaction(tx, connection)
        promiseToast(new Promise(async (res, rej) => {
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash({ commitment: "confirmed" });
            const confirm_result = await connection.confirmTransaction({
                blockhash,
                lastValidBlockHeight,
                signature,
            }, "confirmed");
            if (confirm_result.value.err) {
                rej("Confirmation failed!")
            } else {
                callback()
                res(true)
            }
        }), {
            pending: "Waiting for confirmation...",
            success: "Transaction succeed. Click here to view transaction.",
            error: "Transaction failed!"
        }, {
            onClick: () => window.open(`https://solscan.io/tx/${signature}?cluster=devnet`, "_blank")
        })
        resolve(null)
    } catch (error) {
        reject(null)
    }
}