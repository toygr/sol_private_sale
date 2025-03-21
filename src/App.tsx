// import PrivateSale from './components/PrivateSale'
import './App.css'
import PrivateSale from './components/PrivateSale'
import { StoreProvider } from './store'
import SolanaWalletProvider from './store/SolanaWalletProvider'
function App() {
  return (
    <SolanaWalletProvider>
      <StoreProvider>
        <PrivateSale />
      </StoreProvider>
    </SolanaWalletProvider>
  )
}
export default App