import { useEffect, useRef, useState } from "react"
import { getVestingPDA } from "../services/solana"
import { GlobalVars } from "../utils"
import { useVestingPDA } from "../store"

const CountDown = () => {
    const { vestingPDA } = useVestingPDA()
    const [data, setData] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })
    const ref_vesintPDA = useRef<Awaited<ReturnType<typeof getVestingPDA>> | null>(null)
    useEffect(() => {
        ref_vesintPDA.current = vestingPDA
    }, [vestingPDA])
    const doCount = () => {
        if (!ref_vesintPDA.current) return
        const timestamp = Math.floor(Math.max(0, parseInt(ref_vesintPDA.current.startTime) + parseInt(ref_vesintPDA.current.saleDuration) - Math.floor((new Date().getTime()) / 1000) + GlobalVars.ts_diff))
        setData({
            days: Math.floor(timestamp / 86400),
            hours: Math.floor(timestamp / 3600) % 60,
            minutes: Math.floor(timestamp / 60) % 60,
            seconds: timestamp % 60,
        })
    }
    useEffect(() => {
        setInterval(doCount, 1000);
    }, [])
    return (
        <>
            {data.days + data.hours + data.minutes + data.seconds === 0 &&
                <span className=""> Sale Ended </span>
            }
            {vestingPDA &&
                <div className="w-full flex items-center justify-center gap-10" style={{ fontFamily: "sans-serif" }}>
                    <div className="flex flex-col">
                        <span className="text-8xl max-sm:text-4xl">{data.days}</span>
                        <span className="uppercase">Days</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-8xl max-sm:text-4xl">{data.hours.toString().padStart(2, "0")}</span>
                        <span className="uppercase">Hours</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-8xl max-sm:text-4xl">{data.minutes.toString().padStart(2, "0")}</span>
                        <span className="uppercase">Minutes</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-8xl max-sm:text-4xl">{data.seconds.toString().padStart(2, "0")}</span>
                        <span className="uppercase">Seconds</span>
                    </div>
                </div>
            }
        </>
    )
}
export default CountDown