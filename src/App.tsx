import { Toaster } from 'react-hot-toast'
import styled from 'styled-components'
import ActionPanel from './components/ActionPanel/ActionPanel'
import History from './components/History/History'

const Container = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  background-color: #eee;
  display: flex;
`

const App = () => (
  <Container>
    <ActionPanel />
    <History />
    <Toaster position="top-center" />
  </Container>
)

export default App
