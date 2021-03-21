import { Toaster } from 'react-hot-toast'
import ActionPanel from './components/ActionPanel/ActionPanel'
import { AppContainer } from './components/AppContainer/AppContainer'
import History from './components/History/History'
import { GlobalStyles } from './styles/GlobalStyles'

const App = () => (
  <AppContainer>
    <ActionPanel />
    <History />
    <Toaster position="top-center" />
    <GlobalStyles />
  </AppContainer>
)

export default App
