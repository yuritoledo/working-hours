import { Toaster } from 'react-hot-toast'
import ActionPanel from './components/ActionPanel/ActionPanel'
import History from './components/History/History'
import { GlobalStyles } from './styles/GlobalStyles'

const App = () => (
  <>
    <GlobalStyles />
    <ActionPanel />
    <History />
    <Toaster
      position="top-center"
    />
  </>
)

export default App
