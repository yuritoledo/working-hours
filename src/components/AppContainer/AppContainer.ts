import styled from 'styled-components'

export const AppContainer = styled.div`
  background-color: #efefff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  @media(min-width: 1200px) {
    flex-direction: row;
  }
`
