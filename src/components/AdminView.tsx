
import { useEffect, useState } from "react"
import * as anchor from "@coral-xyz/anchor"
import { useAmounts, useReferCode, useSaleEnded, useVestingPDA, useWalletPubKeyState } from "../store"
import { promiseToast, showToast } from "../utils/toast"
import { program } from "../anchor/setup"
import { PublicKey } from "@solana/web3.js"
import { getVestingPDA, processTxInToast } from "../services/solana"
import { useWallet } from "@solana/wallet-adapter-react"

const AdminView = () => {
    const { buyableAmount } = useAmounts()
    const { publicKey } = useWalletPubKeyState()
    const { sendTransaction } = useWallet()
    const { vestingPDA, setVestingPDA } = useVestingPDA()
    const { isSaleEnded } = useSaleEnded()
    const { referrerCode, setReferrerCode } = useReferCode()
    const [giveAmount, setGiveAmount] = useState(0)
    const [giveAddress, setGiveAddress] = useState("")
    const [referInfo, setReferInfo] = useState<{ code: number; amount: number; }[]>([])
    useEffect(() => {
        if (!vestingPDA) {
            setReferInfo([])
            return
        }
        setReferInfo(vestingPDA.referCodes.map((v, i) => ({
            code: v,
            amount: parseInt(vestingPDA.referAmounts[i]) / 1000000000
        })))
    }, [vestingPDA])
    const giveToken = async () => {
        if (!publicKey) {
            showToast("Connect wallet first", "warn")
            return
        }
        if (giveAddress.trim() === "") {
            showToast("Input address correctly", "warn")
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
            const tx = await program.methods.giveToken(new anchor.BN(giveAmount * 1_000_000_000), code).accounts({
                admin: publicKey,
                user: new PublicKey(giveAddress)
            }).transaction()
            await processTxInToast(
                tx, sendTransaction,
                () => setTimeout(
                    () => {
                        getVestingPDA().then(pda => setVestingPDA(pda))
                        setGiveAmount(0)
                        setGiveAddress("")
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
                <p className="p-4 text-[#A6A6A6] font-medium text-base text-left">Private Sale <span className="italic text-red-700">Admin Page</span></p>
                <div className="w-full text-left">
                    <span>Investor Address</span>
                    <input onChange={e => setGiveAddress(e.target.value)} value={giveAddress} placeholder="Solana address" className="w-full bg-[#010101] border border-[#1B1B1D] p-4 rounded-xl disabled:cursor-not-allowed disabled:text-white/50 disabled:font-bold" />
                </div>
                <div className="flex items-end w-full gap-2">
                    <div className="w-full">
                        <p className="text-left">
                            Available amount you can give: {buyableAmount}
                        </p>
                        <input onChange={e => setGiveAmount(Number(e.target.value))} value={giveAmount} placeholder="Enter Amount" className="w-full bg-[#010101] border border-[#1B1B1D] p-4 rounded-xl" />
                    </div>
                    <div className="text-left">
                        <span>Referrer Code(Optional)</span>
                        <input onChange={e => setReferrerCode(e.target.value.trim())} value={referrerCode} placeholder="eg:12345" className="w-full bg-[#010101] border border-[#1B1B1D] p-4 rounded-xl disabled:cursor-not-allowed disabled:text-white/50 disabled:font-bold" />
                    </div>
                </div>
                <div className="flex justify-between gap-4">
                    <button onClick={giveToken} className="w-full bg-[#0D4D0D] border border-[#1B1B1D] rounded-xl flex items-center justify-center gap-3 text-[#DADADA] font-medium text-sm py-3 hover:opacity-80 disabled:cursor-not-allowed" disabled={!publicKey || isSaleEnded} >
                        Direct sale to investor
                    </button>
                </div>
            </div>
            <div className="border-[1px] border-[#1B1B1D] rounded-[28px] p-4">
                <div className="flex flex-col justify-center items-center">
                    <p className="p-4 pt-0 text-[#A6A6A6] font-medium text-base text-left">Referring Info</p>
                    <div className="w-full max-w-2xl">
                        <div className="w-full flex">
                            <div className="w-full border border-r-0 border-b-0 border-white/40">Referral code</div>
                            <div className="w-full border border-b-0 border-white/40">Saled amount</div>
                        </div>
                        {
                            referInfo.map((v, i) =>
                                <div key={i} className="w-full flex">
                                    <div className="w-full border border-r-0 border-white/40">{v.code}</div>
                                    <div className="w-full border border-white/40">{v.amount} ED</div>
                                </div>
                            )
                        }

                    </div>
                </div>
            </div>
        </>
    )
}
export default AdminView