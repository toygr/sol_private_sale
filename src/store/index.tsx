import * as anchor from "@coral-xyz/anchor";
import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getCurrentTimestamp, getUserInfoPDA, getVestingPDA } from "../services/solana";
import { getCliffDuration, getInitialUnlockRate, getVestingDuration } from "../utils";
type StoreType = {
    publicKey: anchor.web3.PublicKey | undefined,
    buttonState: "connecting" | "connected" | "disconnecting" | "has-wallet" | "no-wallet",
    isSaleEnded: boolean,
    userPDA: Awaited<ReturnType<typeof getUserInfoPDA>> | null,
    setUserPDA: React.Dispatch<React.SetStateAction<Awaited<ReturnType<typeof getUserInfoPDA>> | null>>,
    vestingPDA: Awaited<ReturnType<typeof getVestingPDA>> | null,
    setVestingPDA: React.Dispatch<React.SetStateAction<Awaited<ReturnType<typeof getVestingPDA>> | null>>,
    referrerCode: string,
    setReferrerCode: React.Dispatch<React.SetStateAction<string>>
    ,
    unlockedAmount: number,
    buyableAmount: number,
    vestedRate: number,
    claimableAmount: number,
}
const initialStoreValue: StoreType = {
    publicKey: undefined,
    buttonState: "no-wallet",
    isSaleEnded: false,
    userPDA: null,
    setUserPDA: () => { },
    vestingPDA: null,
    setVestingPDA: () => { },
    referrerCode: "",
    setReferrerCode: () => { },
    unlockedAmount: 0,
    buyableAmount: 0,
    vestedRate: 0,
    claimableAmount: 0,
}
const Store = createContext<StoreType>(initialStoreValue)
export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const { publicKey, buttonState } = useWalletMultiButton({ onSelectWallet() { }, });
    const [isSaleEnded, setSaleEnded] = useState(false)
    const [userPDA, setUserPDA] = useState<Awaited<ReturnType<typeof getUserInfoPDA>> | null>(null)
    const [referrerCode, setReferrerCode] = useState<string>("")
    const [unlockedAmount, setUnlockedAmount] = useState<number>(0)
    const [buyableAmount, setBuyableAmount] = useState<number>(0)
    const [vestedRate, setVestedRate] = useState<number>(0)
    const [claimableAmount, setClaimableAmount] = useState<number>(0)
    const [vestingPDA, setVestingPDA] = useState<Awaited<ReturnType<typeof getVestingPDA>> | null>(null)
    useEffect(() => {
        getVestingPDA().then(pda => setVestingPDA(pda))
        getCurrentTimestamp()
    }, [])
    useEffect(() => {
        setReferrerCode("")
        if (!publicKey) {
            setUserPDA(null)
            return
        }
        getUserInfoPDA(publicKey).then(pda => setUserPDA(pda)).catch(() => setUserPDA(null))
    }, [publicKey])
    useEffect(() => {
        if (vestingPDA) {
            setBuyableAmount((parseInt(vestingPDA.amount) - parseInt(vestingPDA.claimedAmount)) / 1000000)
        } else {
            setBuyableAmount(0)
        }
    }, [vestingPDA])
    useEffect(() => {
        if (!vestingPDA) return
        (async () => {
            const tsp_listedToken = parseInt(vestingPDA.listedTime)
            const curTimestamp = await getCurrentTimestamp()
            if (parseInt(vestingPDA.startTime) + parseInt(vestingPDA.saleDuration) < curTimestamp) {
                setSaleEnded(true)
            }
            if (!userPDA) return
            if (tsp_listedToken === 0) return
            const time_since_token_listed = curTimestamp - tsp_listedToken
            const vesting_duration = getVestingDuration(userPDA.totalAllocation, vestingPDA.vestingDurationX1)
            const cliff_duration = getCliffDuration(userPDA.totalAllocation, vestingPDA.vestingDurationX1)
            const initialUnlockRate = getInitialUnlockRate(userPDA.totalAllocation)
            const vested_rate = time_since_token_listed <= 0 ? 0 : Math.min(time_since_token_listed / vesting_duration, 1)
            setVestedRate(vested_rate)
            const vesting_amount = time_since_token_listed < cliff_duration ? 0 : parseInt(userPDA.totalAllocation) * (1 - initialUnlockRate) * vested_rate
            setUnlockedAmount(vesting_amount / 1_000_000)
            const available_to_claim = time_since_token_listed <= 0 ? 0 : (parseInt(userPDA.totalAllocation) * initialUnlockRate + vesting_amount - parseInt(userPDA.claimedAmount)) / 1_000_000
            setClaimableAmount(available_to_claim)
        })()
    }, [userPDA, vestingPDA])
    return (
        <Store.Provider value={{
            publicKey, buttonState, isSaleEnded, userPDA, setUserPDA, unlockedAmount, buyableAmount, vestedRate, claimableAmount, vestingPDA, setVestingPDA, referrerCode, setReferrerCode
        }}>
            {children}
        </Store.Provider>
    )
}
export const useWalletPubKeyState = () => ({
    publicKey: useContext(Store).publicKey,
    buttonState: useContext(Store).buttonState,
})
export const useVestingPDA = () => ({
    vestingPDA: useContext(Store).vestingPDA,
    setVestingPDA: useContext(Store).setVestingPDA,
})
export const useUserPDA = () => ({
    userPDA: useContext(Store).userPDA,
    setUserPDA: useContext(Store).setUserPDA,
})
export const useReferCode = () => ({
    referrerCode: useContext(Store).referrerCode,
    setReferrerCode: useContext(Store).setReferrerCode,
})
export const useAmounts = () => ({
    buyableAmount: useContext(Store).buyableAmount,
    claimableAmount: useContext(Store).claimableAmount,
    unlockedAmount: useContext(Store).unlockedAmount,
    vestedRate: useContext(Store).vestedRate,
})
export const useSaleEnded = () => ({
    isSaleEnded: useContext(Store).isSaleEnded,
})