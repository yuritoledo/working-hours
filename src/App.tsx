import { Toaster } from 'react-hot-toast'
import styled from 'styled-components'
import ActionPanel from './components/ActionPanel/ActionPanel'
import History from './components/History/History'
import { GlobalStyles } from './styles/GlobalStyles'

const Container = styled.div`
  background-color: #efefff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  @media(min-width: 800px) {
    flex-direction: row;
  }
`

const App = () => (
  <Container>
    <ActionPanel />
    <History />
    <Toaster position="top-center" />
    <GlobalStyles />
  </Container>
)

export default App
