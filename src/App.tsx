// import PrivateSale from './components/PrivateSale'
import './App.css'
import { StoreProvider } from './store'
import SolanaWalletProvider from './store/SolanaWalletProvider'
function App() {
  return (
    <SolanaWalletProvider>
      <StoreProvider>
        {/* <PrivateSale /> */}
        <div>
          Coming Soon
        </div>
      </StoreProvider>
    </SolanaWalletProvider>
  )
}
export default App