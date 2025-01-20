import * as anchor from "@coral-xyz/anchor";
import { getOrCreateAssociatedTokenAccount, getUserInfoPDA, getVestingPDA, processTxInToast } from "../services/solana"
import { promiseToast, showToast } from "../utils/toast";
import { PublicKey } from "@solana/web3.js";
import { MINT_ADDRESS, program, USDT_MINT_ADDRESS } from "../anchor/setup";
import { timestamp2date } from "../utils";
import { useAmounts, useReferCode, useSaleEnded, useUserPDA, useVestingPDA, useWalletPubKeyState } from "../store";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

const InvestorSale = () => {
    const { publicKey } = useWalletPubKeyState()
    const { isSaleEnded } = useSaleEnded()
    const { vestingPDA, setVestingPDA } = useVestingPDA()
    const { userPDA, setUserPDA } = useUserPDA()
    const { buyableAmount, claimableAmount, unlockedAmount, vestedRate } = useAmounts()
    const [buyAmount, setBuyAmount] = useState<number>(0)
    const [initialUnlock, setInitialUnlock] = useState<number>(0)
    const { referrerCode, setReferrerCode } = useReferCode()
    const { sendTransaction } = useWallet()
    useEffect(() => {
        if (!userPDA) return
        if (!vestingPDA) return
        setInitialUnlock(parseInt(userPDA.totalAllocation) * 0.15 / 1_000_000_000);
    }, [userPDA, vestingPDA])
    const buyToken = async (paySol: boolean) => {
        if (!publicKey) {
            showToast("Connect wallet first", "warn")
            return
        }
        if (buyAmount > buyableAmount) {
            showToast("Amount exceeds", "warn")
            return
        }
        let code = 0
        if (referrerCode !== "") {
            if (/^(0|[1-9]\d*)$/.test(referrerCode)) {
                code = parseInt(referrerCode)
            } else {
                showToast("Referral code type mismatch", "error")
                return
            }
        }
        promiseToast(new Promise(async (resolve, reject) => {
            const userUsdtAta = await getOrCreateAssociatedTokenAccount(publicKey, new PublicKey(USDT_MINT_ADDRESS), sendTransaction, false)
            const tx = await program.methods.buyToken(new anchor.BN(buyAmount * 1_000_000_000), paySol, code).accounts({
                user: publicKey,
                priceUpdate: new PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE"),
                userUsdtAta,
            }).transaction()
            await processTxInToast(
                tx, sendTransaction,
                () => setTimeout(
                    () => {
                        getVestingPDA().then(pda => setVestingPDA(pda))
                        if (publicKey) getUserInfoPDA(publicKey).then(pda => setUserPDA(pda))
                        setBuyAmount(0)
                    }, 1000),
                resolve, reject)
        }), {
            pending: `Opening wallet...`,
            error: "Your operation failed."
        })
    }
    const handleClaim = async () => {
        if (!publicKey) return
        if (claimableAmount <= 0) {
            showToast("No available tokens", "warn")
            return
        }
        promiseToast(new Promise(async (resolve, reject) => {
            const userAta = await getOrCreateAssociatedTokenAccount(publicKey, new PublicKey(MINT_ADDRESS), sendTransaction)
            const tx = await program.methods.claimToken(new anchor.BN(claimableAmount * 1_000_000_000)).accounts({
                user: publicKey,
                userAta,
            }).transaction()
            await processTxInToast(
                tx, sendTransaction,
                () => setTimeout(
                    () => {
                        getVestingPDA().then(pda => setVestingPDA(pda))
                        if (publicKey) getUserInfoPDA(publicKey).then(pda => setUserPDA(pda))
                        setBuyAmount(0)
                    }, 1000),
                resolve, reject)
        }), {
            pending: `Opening wallet...`,
            error: "Your operation failed."
        })
    }
    return (
        <>
            <div className="border-[1px] border-[#1B1B1D] rounded-[28px] p-4 flex flex-col gap-4">
                <p className="p-4 text-[#A6A6A6] font-medium text-base text-left">Private Sale Details</p>
                <div className="flex items-end w-full gap-2">
                    <div className="w-full">
                        {vestingPDA && <p className="text-left">
                            Available amount you can buy: {buyableAmount}
                        </p>}
                        <input onChange={e => setBuyAmount(Number(e.target.value))} value={buyAmount} placeholder="Enter Amount" className="w-full bg-[#010101] border border-[#1B1B1D] p-4 rounded-xl" />
                    </div>
                    <div className="text-left">
                        <span>Referrer Code(Optional)</span>
                        <input onChange={e => setReferrerCode(e.target.value.trim())} value={userPDA ? userPDA.referCode > 0 ? userPDA.referCode : referrerCode : referrerCode} disabled={!!userPDA && userPDA.referCode > 0} placeholder="eg:12345" className="w-full bg-[#010101] border border-[#1B1B1D] p-4 rounded-xl disabled:cursor-not-allowed disabled:text-white/50 disabled:font-bold" />
                    </div>
                </div>
                <div className="flex justify-between gap-4">
                    <button onClick={() => buyToken(true)} className="w-full bg-[#0D0D0D] border border-[#1B1B1D] rounded-xl flex items-center justify-center gap-3 text-[#DADADA] font-medium text-sm py-3 hover:opacity-80 disabled:cursor-not-allowed" disabled={!publicKey || isSaleEnded}>
                        <img src="/SOL.png" className="w-6 h-6" />
                        Buy token with SOL
                    </button>
                    <button onClick={() => buyToken(false)} className="w-full bg-gradient-to-b from-[#323233] to-[#FFFFFF]/25 border border-[#4E4E4E] rounded-xl flex items-center justify-center gap-3 text-[#DADADA] font-medium text-sm py-3 hover:opacity-80 disabled:cursor-not-allowed" disabled={!publicKey || isSaleEnded}>
                        <img src="/USDT.png" className="w-6 h-6" />
                        Buy token with USDT
                    </button>
                </div>
            </div>

            {userPDA && vestingPDA &&
                <div className="border-[1px] border-[#1B1B1D] rounded-[28px] p-4">
                    <div>
                        <p className="p-4 text-[#A6A6A6] font-medium text-base text-left">Private Sale Details</p>
                        <div className="grid grid-cols-4 gap-3 pt-1">
                            <div className="bg-[#000000] border border-[#1B1B1D] rounded-xl p-4 flex flex-col items-start gap-3 relative">
                                <p className="text-sm text-[#FFFFFF52]">Total Tokens</p>
                                <p className="text-[20px] font-medium text-[#FFFFFF]">{parseInt(userPDA.totalAllocation) / 1000000000}</p>
                                <div className="absolute top-0 left-4 border-[1px] w-9 border-[#FFFFFF]"></div>
                            </div>
                            <div className="bg-[#000000] border border-[#1B1B1D] rounded-xl p-4 flex flex-col items-start gap-3 relative">
                                <p className="text-sm text-[#FFFFFF52]">Initial Unlock</p>
                                <p className="text-[20px] font-medium text-[#FFFFFF]">
                                    {initialUnlock}
                                    <span className="text-[#FFFFFF52]">(15%)</span></p>
                                <div className="absolute top-0 left-4 border-[1px] w-9 border-[#FFFFFF]"></div>
                            </div>
                            <div className="bg-[#000000] border border-[#1B1B1D] rounded-xl p-4 flex flex-col items-start gap-3 relative">
                                <p className="text-sm text-[#FFFFFF52]">Claimed Tokens</p>
                                <p className="text-[20px] font-medium text-[#FFFFFF]">{parseInt(userPDA.claimedAmount) / 1000000000}</p>
                                <div className="absolute top-0 left-4 border-[1px] w-9 border-[#FFFFFF]"></div>
                            </div>
                            <div className="bg-[#000000] border border-[#1B1B1D] rounded-xl p-4 flex flex-col items-start gap-3 relative">
                                <p className="text-sm text-[#FFFFFF52]">Available to Claim</p>
                                <p className="text-[20px] font-medium text-[#26D2A0]">
                                    {Math.floor(Math.max(0, claimableAmount) * 100) / 100}
                                </p>
                                <div className="absolute top-0 left-4 border-[1px] w-9 border-[#FFFFFF]"></div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-[52px] border-[#FFFFFF]/20 border-dashed" />

                    <div>
                        <p className="p-4 pt-0 text-[#A6A6A6] font-medium text-base text-left">Vesting Timeline</p>
                        <div className="grid grid-cols-1 gap-2.5 pt-1 pb-6">
                            <div className="bg-[#0C0C0C]/50 border border-[#191919] rounded-xl p-4 flex justify-between ">
                                <div className="flex flex-col gap-3 text-left">
                                    <p className="text-[#FFFFFF]/50 font-medium text-sm">Initial Unlock</p>
                                    <p className="text-[#FFFFFF] font-medium text-sm">
                                        {timestamp2date((parseInt(vestingPDA.startTime)) * 1000)} - {timestamp2date((parseInt(vestingPDA.startTime) + parseInt(vestingPDA.saleDuration)) * 1000)}</p>
                                </div>
                                <div className="flex flex-col gap-3 text-right">
                                    <p className="text-[#FFFFFF]/50 font-medium text-sm">Unlock Amount</p>
                                    <p className="text-[#26D2A0] font-medium text-sm">{initialUnlock} Tokens (15%)</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2.5 pt-1 pb-6">
                            <div className="bg-[#0C0C0C]/50 border border-[#191919] rounded-xl p-4 flex justify-between ">
                                <div className="flex flex-col gap-3 text-left">
                                    <p className="text-[#FFFFFF]/50 font-medium text-sm">Vesting Period</p>
                                    <p className="text-[#FFFFFF] font-medium text-sm">{timestamp2date((parseInt(vestingPDA.startTime) + parseInt(vestingPDA.saleDuration)) * 1000)} - {timestamp2date((parseInt(vestingPDA.startTime) + parseInt(vestingPDA.saleDuration) + parseInt(vestingPDA.amount < new anchor.BN(100_000_000000000) ? vestingPDA.vestingDurationShort : vestingPDA.vestingDurationLong)) * 1000)}</p>
                                </div>
                                <div className="flex flex-col gap-3 text-right">
                                    <p className="text-[#FFFFFF]/50 font-medium text-sm">Unlock Amount</p>
                                    <p className="text-[#26D2A0] font-medium text-sm">{Math.floor(Math.max(0, unlockedAmount) * 100) / 100} Tokens</p>
                                </div>
                            </div>
                            <div className='w-full h-1 bg-gray-800 relative'>
                                <div className='h-1 bg-green-700' style={{ width: `${Math.round(vestedRate * 100)}%` }} />
                            </div>
                        </div>
                        <button onClick={handleClaim} className="rounded-xl border border-[#202020] bg-gradient-to-b from-[#FFFFFF] to-[#B5B5B5] w-full p-5 font-semibold text-[#000000] text-base hover:opacity-80">Claim {Math.floor(Math.max(0, claimableAmount) * 100) / 100} Available Tokens</button>
                    </div>
                </div>
            }
        </>
    )
}
export default InvestorSale