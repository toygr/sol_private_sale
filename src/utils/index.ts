import * as anchor from "@coral-xyz/anchor";
import {
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    TOKEN_2022_PROGRAM_ID
} from "@solana/spl-token";
import { connection } from "../anchor/setup";
import { Transaction } from "@solana/web3.js";
export const GlobalVars = {
    ts_diff: 0
}
export async function getOrCreateAssociatedTokenAccount(pubkey: anchor.web3.PublicKey, mintPublicKey: anchor.web3.PublicKey, sendTransaction: (transaction: anchor.web3.Transaction | anchor.web3.VersionedTransaction, connection: anchor.web3.Connection, options?: any) => Promise<anchor.web3.TransactionSignature>
    , isToken2022: boolean = true) {
    const associatedAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        pubkey,
        false,
        isToken2022 ? TOKEN_2022_PROGRAM_ID : undefined
    );
    const accountInfo = await connection.getAccountInfo(associatedAddress);
    if (accountInfo) return associatedAddress
    const tx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
            pubkey, // payer
            associatedAddress,
            pubkey, // owner
            mintPublicKey,
            isToken2022 ? TOKEN_2022_PROGRAM_ID : undefined
        )
    );
    const signature = await sendTransaction(tx, connection, { commitment: "confirmed" });
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash({ commitment: "confirmed" });
    await connection.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature,
    }, "confirmed");
    return associatedAddress;
}
export async function getCurrentTimestamp() {
    const slot = await connection.getSlot('finalized');
    const blockTime = await connection.getBlockTime(slot) || 0
    console.log(blockTime, 'Latest block timestamp:', new Date(blockTime * 1000).toUTCString());
}
export const timestamp2date = (timestamp_ms: number) => new Date(timestamp_ms).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })