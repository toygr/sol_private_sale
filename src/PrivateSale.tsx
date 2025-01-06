const PrivateSale = () => {
  return (
    <div className="pt-[158px] pb-[135px] font-britti">
      <div className="flex items-center justify-between text-fontPrimary">
        <h1 className="text-[32px] font-semibold">Token Private Sale</h1>
        <button className="bg-gradient-to-b from-[#26D2A0] to-[#027E5A] rounded-xl px-7 py-3.5 border border-[#FFFFFF38] text-base font-semibold">Select Wallet</button>
      </div>

      <div className="flex flex-col gap-5 mt-12 rounded-[40px] border border-[#1B1B1D] bg-[#020202] px-3 pb-3 main relative">
    
        <div className="absolute -top-3 -left-3 p-8 blur-3xl bg-[#FFFFFF]">
          
        </div>

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
              <span className="text-[#FFFFFF] font-medium text-[20px] pl-2 border-l border-[#FFFFFF38]">01 Apr 2024 - 24 Apr 2024</span>
            </div>
            <div className="flex flex-col items-start justify-between gap-3">
              <span className="text-[#FFFFFF]/50 font-medium text-sm pl-2 border-l border-[#878787]">Token Price</span>
              <span className="text-[#FFFFFF] font-medium text-[20px] pl-2 border-l border-[#FFFFFF38]">1 Token = 0.1 SOL</span>
            </div>
          </div>
        </div>

        <div className="border-[1px] border-[#1B1B1D] rounded-[28px] p-4 flex flex-col gap-4">
          <p className="p-4 text-[#A6A6A6] font-medium text-base text-left">Private Sale Details</p>
          <div className="flex justify-between gap-4">
            <button className="w-full bg-[#0D0D0D] border border-[#1B1B1D] rounded-xl flex items-center justify-center gap-3 text-[#DADADA] font-medium text-sm py-3">
              <img src="/SOL.png" className="w-6 h-6" />
              Pay with SOL
            </button>
            <button className="w-full bg-gradient-to-b from-[#323233] to-[#FFFFFF]/25 border border-[#4E4E4E] rounded-xl flex items-center justify-center gap-3 text-[#DADADA] font-medium text-sm py-3">
              <img src="/USDT.png" className="w-6 h-6" />
              Pay with USDT
            </button>
          </div>
          <input placeholder="Enter Amount" className="bg-[#010101] border border-[#1B1B1D] p-4 rounded-xl" />
          <button className="mt-2 text-[#000000] font-semibold text-base border border-[#202020] rounded-xl bg-gradient-to-b from-[#FFFFFF] to-[#B5B5B5] py-5">
            Buy Tokens
          </button>
        </div>

        <div className="border-[1px] border-[#1B1B1D] rounded-[28px] p-4">
          <div>
            <p className="p-4 text-[#A6A6A6] font-medium text-base text-left">Private Sale Details</p>
            <div className="grid grid-cols-4 gap-3 pt-1">
              <div className="bg-[#000000] border border-[#1B1B1D] rounded-xl p-4 flex flex-col items-start gap-3 relative">
                <p className="text-sm text-[#FFFFFF52]">Total Tokens</p>
                <p className="text-[20px] font-medium text-[#FFFFFF]">10,000</p>
                <div className="absolute top-0 left-4 border-[1px] w-9 border-[#FFFFFF]"></div>
              </div>
              <div className="bg-[#000000] border border-[#1B1B1D] rounded-xl p-4 flex flex-col items-start gap-3 relative">
                <p className="text-sm text-[#FFFFFF52]">Initial Unlock</p>
                <p className="text-[20px] font-medium text-[#FFFFFF]">1,500 <span className="text-[#FFFFFF52]">(15%)</span></p>
                <div className="absolute top-0 left-4 border-[1px] w-9 border-[#FFFFFF]"></div>
              </div>
              <div className="bg-[#000000] border border-[#1B1B1D] rounded-xl p-4 flex flex-col items-start gap-3 relative">
                <p className="text-sm text-[#FFFFFF52]">Claimed Tokens</p>
                <p className="text-[20px] font-medium text-[#FFFFFF]">0</p>
                <div className="absolute top-0 left-4 border-[1px] w-9 border-[#FFFFFF]"></div>
              </div>
              <div className="bg-[#000000] border border-[#1B1B1D] rounded-xl p-4 flex flex-col items-start gap-3 relative">
                <p className="text-sm text-[#FFFFFF52]">Available to Claim</p>
                <p className="text-[20px] font-medium text-[#26D2A0]">1,500</p>
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
                  <p className="text-[#FFFFFF] font-medium text-sm">01 Apr 2024 - 24 Apr 2024</p>
                </div>
                <div className="flex flex-col gap-3 text-right">
                  <p className="text-[#FFFFFF]/50 font-medium text-sm">Unlock Amount</p>
                  <p className="text-[#26D2A0] font-medium text-sm">1,500 Tokens (15%)</p>
                </div>
              </div>
              <div className="bg-[#0C0C0C]/50 border border-[#191919] rounded-xl p-4 flex justify-between ">
                <div className="flex flex-col gap-3 text-left">
                  <p className="text-[#FFFFFF]/50 font-medium text-sm">Initial Unlock</p>
                  <p className="text-[#FFFFFF] font-medium text-sm">01 Apr 2024 - 24 Apr 2024</p>
                </div>
                <div className="flex flex-col gap-3 text-right">
                  <p className="text-[#FFFFFF]/50 font-medium text-sm">Unlock Amount</p>
                  <p className="text-[#26D2A0] font-medium text-sm">1,500 Tokens (15%)</p>
                </div>
              </div>
              <div className="bg-[#0C0C0C]/50 border border-[#191919] rounded-xl p-4 flex justify-between ">
                <div className="flex flex-col gap-3 text-left">
                  <p className="text-[#FFFFFF]/50 font-medium text-sm">Initial Unlock</p>
                  <p className="text-[#FFFFFF] font-medium text-sm">01 Apr 2024 - 24 Apr 2024</p>
                </div>
                <div className="flex flex-col gap-3 text-right">
                  <p className="text-[#FFFFFF]/50 font-medium text-sm">Unlock Amount</p>
                  <p className="text-[#26D2A0] font-medium text-sm">1,500 Tokens (15%)</p>
                </div>
              </div>
              <div className="bg-[#0C0C0C]/50 border border-[#191919] rounded-xl p-4 flex justify-between ">
                <div className="flex flex-col gap-3 text-left">
                  <p className="text-[#FFFFFF]/50 font-medium text-sm">Initial Unlock</p>
                  <p className="text-[#FFFFFF] font-medium text-sm">01 Apr 2024 - 24 Apr 2024</p>
                </div>
                <div className="flex flex-col gap-3 text-right">
                  <p className="text-[#FFFFFF]/50 font-medium text-sm">Unlock Amount</p>
                  <p className="text-[#26D2A0] font-medium text-sm">1,500 Tokens (15%)</p>
                </div>
              </div>
              <div className="bg-[#0C0C0C]/50 border border-[#191919] rounded-xl p-4 flex justify-between ">
                <div className="flex flex-col gap-3 text-left">
                  <p className="text-[#FFFFFF]/50 font-medium text-sm">Initial Unlock</p>
                  <p className="text-[#FFFFFF] font-medium text-sm">01 Apr 2024 - 24 Apr 2024</p>
                </div>
                <div className="flex flex-col gap-3 text-right">
                  <p className="text-[#FFFFFF]/50 font-medium text-sm">Unlock Amount</p>
                  <p className="text-[#26D2A0] font-medium text-sm">1,500 Tokens (15%)</p>
                </div>
              </div>
            </div>
            <button className="rounded-xl border border-[#202020] bg-gradient-to-b from-[#FFFFFF] to-[#B5B5B5] w-full p-5 font-semibold text-[#000000] text-base">Claim 1,500 Available Tokens</button>
          </div>
        </div>
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