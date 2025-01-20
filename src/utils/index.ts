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