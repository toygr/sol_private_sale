import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useMemo } from 'react';
import { LABELS, timestamp2date } from '../utils';
import CountDown from "./CountDown";
import InvestorSale from "./InvestorSale";
import AdminView from './AdminView';
import { useVestingPDA, useWalletPubKeyState } from '../store';
const ADMIN_WALLET = "6ubMCJm3AQNcmUG9gxe44VjhxwqMy8YWHhHbGqFc6jfC"
const PrivateSale = () => {
  const { publicKey, buttonState } = useWalletPubKeyState()
  const { vestingPDA } = useVestingPDA()
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

          <div className="flex w-full px-4 pb-8 pt-7">
            <div className="flex w-full flex-col items-start justify-start gap-3">
              <span className="text-[#FFFFFF]/50 font-medium text-sm pl-2 border-l border-[#878787]">Sale Period</span>
              <span className="text-[#FFFFFF] font-medium text-[20px] pl-2 border-l border-[#FFFFFF38]">
                {vestingPDA ? timestamp2date(parseInt(vestingPDA.startTime) * 1000) : "-"}
                <> - </>
                {vestingPDA ? timestamp2date((parseInt(vestingPDA.startTime) + parseInt(vestingPDA.saleDuration)) * 1000) : "-"}
              </span>
            </div>
            <div className="flex w-full flex-col items-start gap-3 text-left">
              <span className="text-[#FFFFFF]/50 font-medium text-sm pl-2 border-l border-[#878787]">Token Price</span>
              <div className="text-[#FFFFFF] font-medium text-[20px] pl-2 border-l border-[#FFFFFF38]">
                1 Token = $0.025 <br />
                <span className='text-[14px] text-white/50'>1% discount if providing refer code</span>
              </div>
            </div>
          </div>
          <CountDown />
        </div>
        {publicKey?.toBase58() === ADMIN_WALLET ?
          <AdminView /> :
          <InvestorSale />}
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