import * as anchor from "@coral-xyz/anchor";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { useEffect, useMemo, useState } from 'react';
import { getCurrentTimestamp, getUserInfoPDA, getVestingPDA } from '../services/solana';
import { getOrCreateAssociatedTokenAccount, timestamp2date } from '../utils';
import { PublicKey } from '@solana/web3.js';
import { connection, MINT_ADDRESS, program, USDT_MINT_ADDRESS } from '../anchor/setup';
import { useWallet } from "@solana/wallet-adapter-react";
import { promiseToast, showToast } from "../utils/toast";
import CountDown from "./CountDown";
const PrivateSale = () => {

  const { sendTransaction } = useWallet();
  const { publicKey, buttonState } = useWalletMultiButton({ onSelectWallet() { }, });
  const LABELS = {
    'change-wallet': 'Change wallet',
    connecting: 'Connecting ...',
    'copy-address': 'Copy address',
    copied: 'Copied',
    disconnect: 'Disconnect',
    'has-wallet': 'Connect',
    'no-wallet': 'Select Wallet',
  } as const;
  const content = useMemo(() => {
    if (publicKey) {
      const base58 = publicKey.toBase58();
      return base58.slice(0, 3) + '..' + base58.slice(-3);
    } else if (buttonState === 'connecting' || buttonState === 'has-wallet') {
      return LABELS[buttonState];
    } else {
      return LABELS['no-wallet'];
    }
  }, [buttonState, publicKey]);
  const [isSaleEnded, setSaleEnded] = useState(false)
  const [vestingPDA, setVestingPDA] = useState<Awaited<ReturnType<typeof getVestingPDA>> | null>(null)
  const [userPDA, setUserPDA] = useState<Awaited<ReturnType<typeof getUserInfoPDA>> | null>(null)
  const [initialUnlock, setInitialUnlock] = useState<number>(0)
  const [unlockedAmount, setUnlockedAmount] = useState<number>(0)
  const [buyableAmount, setBuyableAmount] = useState<number>(0)
  const [buyAmount, setBuyAmount] = useState<number>(0)
  const [vestedRate, setVestedRate] = useState<number>(0)
  const [claimableAmount, setClaimableAmount] = useState<number>(0)
  useEffect(() => {
    getVestingPDA().then(pda => setVestingPDA(pda))
    getCurrentTimestamp()
  }, [])
  useEffect(() => {
    if (!publicKey) {
      setUserPDA(null)
      return
    }
    getUserInfoPDA(publicKey).then(pda => setUserPDA(pda))
  }, [publicKey])
  useEffect(() => {
    if (vestingPDA) {
      setBuyableAmount((parseInt(vestingPDA.amount) / 2 - parseInt(vestingPDA.investorClaimed)) / 1000000000)
    } else {
      setBuyableAmount(0)
    }
  }, [vestingPDA])
  useEffect(() => {
    if (!userPDA) return
    if (!vestingPDA) return
    setInitialUnlock(parseInt(userPDA.totalAllocation) * 0.15 / 1_000_000_000);
    (async () => {
      const tsp_saleEnd = parseInt(vestingPDA.startTime) + parseInt(vestingPDA.saleDuration)
      const curTimestamp = await getCurrentTimestamp()
      if (parseInt(vestingPDA.startTime) + parseInt(vestingPDA.saleDuration) < curTimestamp) {
        setSaleEnded(true)
      }
      const time_since_saleEnd = curTimestamp - tsp_saleEnd
      const vesting_duration = parseInt(vestingPDA.vestingDuration)
      const vested_rate = Math.min(time_since_saleEnd / vesting_duration, 1)
      setVestedRate(vested_rate)
      const vesting_amount = parseInt(userPDA.totalAllocation) * 0.85 * vested_rate
      setUnlockedAmount(vesting_amount / 1_000_000_000)
      const available_to_claim = (parseInt(userPDA.totalAllocation) * 0.15 + vesting_amount - parseInt(userPDA.claimedAmount)) / 1_000_000_000
      setClaimableAmount(available_to_claim)
    })()
  }, [userPDA, vestingPDA])
  const buyToken = async (paySol: boolean) => {
    if (!publicKey) return
    if (buyAmount > buyableAmount) {
      showToast("Amount exceeds", "warn")
      return
    }
    promiseToast(new Promise(async (resolve, reject) => {
      const userUsdtAta = await getOrCreateAssociatedTokenAccount(publicKey, new PublicKey(USDT_MINT_ADDRESS), sendTransaction, false)
      const tx = await program.methods.allowClaim(new anchor.BN(buyAmount * 1_000_000_000), true, paySol).accounts({
        user: publicKey,
        priceUpdate: new PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE"),
        userUsdtAta,
      }).transaction()
      await processTxInToast(tx, resolve, reject)
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
      await processTxInToast(tx, resolve, reject)
    }), {
      pending: `Opening wallet...`,
      error: "Your operation failed."
    })
  }

  const processTxInToast = async (tx: anchor.web3.Transaction, resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
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
          setTimeout(() => {
            getVestingPDA().then(pda => setVestingPDA(pda))
            if (publicKey) getUserInfoPDA(publicKey).then(pda => setUserPDA(pda))
            setBuyAmount(0)
          }, 1000);
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
  return (
    <div className="pt-[158px] pb-[135px] font-britti">
      <div className="flex items-center justify-between text-fontPrimary">
        <h1 className="text-[32px] font-semibold">Token Private Sale</h1>
        <WalletMultiButton style={{ backgroundImage: "linear-gradient(rgb(38, 210, 160), rgb(2, 126, 90))" }} endIcon={
          publicKey ? <img className="rounded-full" src={`https://i.pravatar.cc/150?u=${publicKey}`} alt="Logo" /> : undefined
        }>
          {content}
        </WalletMultiButton>
      </div>
      <div className="flex flex-col gap-5 mt-12 rounded-[40px] border border-[#1B1B1D] bg-[#020202] px-3 pb-3 main relative">
        <div className="absolute -top-3 -left-3 p-8 blur-3xl bg-[#FFFFFF]" />
        <div className="px-4">
          <div className="flex flex-col items-start justify-center px-4">
            <div className="border-t-[3px] border-[#FFFFFF] inline-block py-5">
              <img src="/Edith.png" className="w-[58px] h-[58px]" />
            </div>
            <div className="py-5 pb-6">
              <span className="text-[#FFFFFF]/60 font-medium text-base">Private Sale Details</span>
            </div>
          </div>
          <hr className=" border-[#FFFFFF]/20 border-dashed" />

          <div className="grid grid-cols-2 px-4 pb-8 pt-7">
            <div className="flex flex-col items-start justify-between gap-3">
              <span className="text-[#FFFFFF]/50 font-medium text-sm pl-2 border-l border-[#878787]">Sale Period</span>
              <span className="text-[#FFFFFF] font-medium text-[20px] pl-2 border-l border-[#FFFFFF38]">
                {vestingPDA ? timestamp2date(parseInt(vestingPDA.startTime) * 1000) : "-"}
                <> - </>
                {vestingPDA ? timestamp2date((parseInt(vestingPDA.startTime) + parseInt(vestingPDA.saleDuration)) * 1000) : "-"}
              </span>
            </div>
            <div className="flex flex-col items-start gap-3">
              <span className="text-[#FFFFFF]/50 font-medium text-sm pl-2 border-l border-[#878787]">Token Price</span>
              <span className="text-[#FFFFFF] font-medium text-[20px] pl-2 border-l border-[#FFFFFF38]">1 Token = $0.05</span>
            </div>
          </div>
          <CountDown vestingPDA={vestingPDA} />
        </div>

        <div className="border-[1px] border-[#1B1B1D] rounded-[28px] p-4 flex flex-col gap-4">
          <p className="p-4 text-[#A6A6A6] font-medium text-base text-left">Private Sale Details</p>
          {vestingPDA && <p className="text-left">
            Available amount you can buy: {buyableAmount}
            {/*  / {parseInt(vestingPDA.amount) / 1000000000} */}
          </p>}
          <input onChange={e => setBuyAmount(Number(e.target.value))} value={buyAmount} placeholder="Enter Amount" className="bg-[#010101] border border-[#1B1B1D] p-4 rounded-xl" />
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
                    <p className="text-[#FFFFFF] font-medium text-sm">{timestamp2date((parseInt(vestingPDA.startTime) + parseInt(vestingPDA.saleDuration)) * 1000)} - {timestamp2date((parseInt(vestingPDA.startTime) + parseInt(vestingPDA.saleDuration) + parseInt(vestingPDA.vestingDuration)) * 1000)}</p>
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
      </div>

      <div className="absolute top-[60px] left-0 w-full border-t-2 border-[#FFFFFF14]"></div>
      <div className="absolute bottom-[60px] left-0 w-full border-t-2 border-[#FFFFFF14]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-[560px] h-full border-l-2 border-[#FFFFFF14]">
        <div className="relative h-full">
          <div className="absolute top-[60px] -translate-x-[8px] -translate-y-[6px] w-2.5 h-2.5 border-2 border-[#FFFFFF14] box-content bg-[#000000] rounded-sm"></div>
          <div className="absolute bottom-[60px] -translate-x-[8px] translate-y-[6px] w-2.5 h-2.5 border-2 border-[#FFFFFF14] box-content bg-[#000000] rounded-sm"></div>
        </div>
      </div>
      <div className="absolute top-0 left-1/2 translate-x-[560px] h-full border-l-2 border-[#FFFFFF14]">
        <div className="relative h-full">
          <div className="absolute top-[60px] -translate-x-[8px] -translate-y-[6px] w-2.5 h-2.5 border-2 border-[#FFFFFF14] box-content bg-[#000000] rounded-sm"></div>
          <div className="absolute bottom-[60px] -translate-x-[8px] translate-y-[6px] w-2.5 h-2.5 border-2 border-[#FFFFFF14] box-content bg-[#000000] rounded-sm"></div>
        </div>
      </div>

    </div>
  )
}

export default PrivateSale