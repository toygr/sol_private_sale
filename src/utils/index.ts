import * as anchor from "@coral-xyz/anchor";
export const GlobalVars = {
    ts_diff: 0
}
export const LABELS = {
    'change-wallet': 'Change wallet',
    connecting: 'Connecting ...',
    'copy-address': 'Copy address',
    copied: 'Copied',
    disconnect: 'Disconnect',
    'has-wallet': 'Connect',
    'no-wallet': 'Select Wallet',
} as const;
export const timestamp2date = (timestamp_ms: number) => new Date(timestamp_ms).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
export const getVestingDuration = (totalAllocation: anchor.BN, vesting_duration_x1: anchor.BN) => {
    const val = parseInt(totalAllocation.div(new anchor.BN(1_000_000)))
    if (val < 200_000) {
        return vesting_duration_x1
    } else if (val < 2_000_000) {
        return parseInt(vesting_duration_x1) * 2
    } else if (val < 10_000_000) {
        return parseInt(vesting_duration_x1) * 4
    } else {
        return parseInt(vesting_duration_x1) * 6
    }
}
export const getCliffDuration = (totalAllocation: anchor.BN, vesting_duration_x1: anchor.BN) => {
    const val = parseInt(totalAllocation.div(new anchor.BN(1_000_000)))
    if (val < 2_000_000) {
        return 0
    } else if (val < 10_000_000) {
        return parseInt(vesting_duration_x1)
    } else {
        return parseInt(vesting_duration_x1) * 2
    }
}
export const getInitialUnlockRate = (totalAllocation: anchor.BN) => {
    const val = parseInt(totalAllocation.div(new anchor.BN(1_000_000)))
    if (val < 80_000) {
        return 0.25
    } else if (val < 2_000_000) {
        return 0.2
    } else if (val < 10_000_000) {
        return 0.15
    } else {
        return 0.1
    }
}