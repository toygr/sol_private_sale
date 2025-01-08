import PrivateSale from './components/PrivateSale'
import SolanaWalletProvider from './store/solana'

import './App.css'
function App() {
  return (
    <>
      <SolanaWalletProvider>
        <PrivateSale />
      </SolanaWalletProvider>
    </>
  )
}
export default App